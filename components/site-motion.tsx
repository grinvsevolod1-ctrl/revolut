"use client"

import { useEffect } from "react"

/**
 * Scroll choreography and interactions, ported from the original vanilla
 * app.js + motion.js into a single client effect. All distances come from the
 * real viewport; no wheel hijacking. The effect fully cleans up (listeners,
 * rAF, and DOM it created) so React strict-mode double-invocation in dev does
 * not duplicate cards or award clones.
 */
export default function SiteMotion() {
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    let cancelled = false

    const $ = (selector: string): any => document.querySelector(selector)
    const clamp = (value: number, low = 0, high = 1) => Math.max(low, Math.min(high, value))
    const mix = (a: number, b: number, p: number) => a + (b - a) * p
    const smooth = (p: number) => p * p * (3 - 2 * p)
    const phase = (p: number, start: number, end: number) => smooth(clamp((p - start) / (end - start)))
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")

    /* ---------- Interactions (formerly app.js) ---------- */
    const dialog: any = $("#action-dialog")
    const titles: Record<string, string> = {
      signup: "Get started", login: "Your account", business: "Business", kids: "Kids & Teens",
      salary: "Move your salary", savings: "Explore savings", cards: "Explore cards",
      air: "Meet AIR", security: "Explore security", invest: "Explore investing",
    }
    document.querySelectorAll("[data-action]").forEach((button: any) =>
      button.addEventListener("click", () => {
        const action = button.dataset.action
        document.dispatchEvent(new CustomEvent("site:action", { detail: { action } }))
        $("#dialog-title").textContent = titles[action] || "Local preview"
        dialog.showModal()
      }, { signal }),
    )
    $("#dismiss")?.addEventListener("click", () => dialog.close(), { signal })

    const menu: any = $(".menu")
    const navigation: any = $("#navigation")
    menu.addEventListener("click", () =>
      menu.setAttribute("aria-expanded", navigation.classList.toggle("open")), { signal })
    navigation.addEventListener("click", (event: any) => {
      if (event.target.closest("a,button")) {
        navigation.classList.remove("open")
        menu.setAttribute("aria-expanded", "false")
      }
    }, { signal })

    document.querySelectorAll("[data-savings]").forEach((button: any) =>
      button.addEventListener("click", () => {
        document.querySelectorAll("[data-savings]").forEach((item: any) => {
          item.classList.toggle("selected", item === button)
          item.setAttribute("aria-pressed", String(item === button))
        })
        const captions: Record<string, string> = {
          Adventure: "Save for your next adventure.",
          Wedding: "Save for your special day.",
          Moving: "Save for a place to call your own.",
        }
        $("#savings-caption").textContent = captions[button.dataset.savings]
        document.querySelectorAll("[data-landscape]").forEach((image: any) =>
          image.classList.toggle("active", image.dataset.landscape === button.dataset.savings))
        document.querySelectorAll("[data-savings-ui]").forEach((image: any) =>
          image.classList.toggle("active", image.dataset.savingsUi === button.dataset.savings))
      }, { signal }),
    )

    /* ---------- Scroll choreography (formerly motion.js) ---------- */
    const hero = $("#home"), stage = $(".hero-stage"), tile = $(".account-tile")
    const intro = $(".hero-copy"), overlay = $(".tile-overlay"), salary = $(".salary-copy")
    const leftTile = $(".satellite-left"), rightTile = $(".satellite-right")
    const cardStory = $("#cards"), cardStage = $(".card-stage"), ring = $(".cards-ring")
    const viewport = $(".cards-viewport")
    const awards = $(".awards-track")
    const themes: [string, string][] = [
      ["platinum", "Platinum"], ["graphite", "Black Metal"], ["gold", "Gold"],
      ["lavender", "Lavender"], ["sage", "Sage Green"], ["rose", "Rose Gold"], ["blue", "Midnight Blue"],
    ]
    themes.forEach(([theme, label], index) => {
      const card = document.createElement("div")
      card.className = `payment-card ${theme}`
      card.innerHTML = `<div class="payment-edge"></div><div class="payment-face payment-front"><span class="card-wordmark">Revolut</span><span class="card-chip"></span><span class="contactless">)))</span><span class="card-tier">${label}</span><span class="card-network ${index % 3 === 1 ? "mastercard" : ""}">${index % 3 === 1 ? "" : "VISA"}</span></div><div class="payment-face payment-back"><span class="magnetic-strip"></span><span class="back-lines"></span><span class="back-wordmark">Revolut</span><span class="card-tier" style="left:auto;right:20px">${label}</span></div>`
      ring.append(card)
    })
    const paymentCards = [...ring.children]
    const awardsOriginals = [...awards.children]
    awardsOriginals.forEach((item: any) => {
      const copy = item.cloneNode(true)
      copy.dataset.clone = ""
      copy.setAttribute("aria-hidden", "true")
      awards.append(copy)
    })

    let dimensions: any, frame = 0, manualRotation = 0
    // Rendered values ease toward their targets each frame so scroll-driven
    // motion is fluid instead of snapping to the raw scroll position.
    let renderedY = scrollY, renderedRotation = 0
    let dragStart: any = null
    let lastMaterial = ""
    const bounds = (el: any) => ({ top: el.getBoundingClientRect().top + scrollY, height: el.offsetHeight })

    function measure() {
      dimensions = {
        width: innerWidth, height: innerHeight, mobile: innerWidth <= 760,
        hero: bounds(hero), stageHeight: stage.offsetHeight,
        cards: bounds(cardStory), cardHeight: cardStage.offsetHeight,
        social: bounds($("#customers")), savings: bounds($("#savings")),
        air: bounds($("#air")), security: bounds($("#security")), invest: bounds($("#invest")),
        closing: bounds($(".closing")),
      }
      dimensions.awardsSet = awardsOriginals.length
        ? (awards.children[awardsOriginals.length] as any).offsetLeft - (awards.children[0] as any).offsetLeft
        : 0
      const radius = dimensions.mobile ? Math.min(240, innerWidth * 0.53) : Math.min(405, innerWidth * 0.27)
      paymentCards.forEach((card: any, index: number) => {
        card.style.transform = `rotateY(${(index * 360) / themes.length}deg) translateZ(${radius}px) rotateZ(-8deg)`
      })
      requestDraw()
    }

    function heroFrame(y: number) {
      const d = dimensions
      const p = clamp((y - d.hero.top) / Math.max(1, d.hero.height - d.stageHeight))
      hero.dataset.progress = p.toFixed(3)
      if (reduced.matches) {
        intro.inert = false
        salary.inert = false
        salary.classList.add("is-visible")
        return
      }
      const travel = Math.max(0, y - d.hero.top)
      const opening = 1 - Math.pow(1 - clamp(travel / 48), 3)
      const shrink = phase(travel, 140, 310)
      const turn = phase(travel, 320, 390)
      const settle = phase(travel, 340, 480)
      const h = d.mobile ? Math.min(d.stageHeight * 0.41, 365) : Math.min(d.stageHeight * 0.59, 510)
      const w = (h * 720) / 1016
      const x = d.mobile ? 0 : d.width * 0.205 * settle
      const compactH = d.mobile ? Math.min(245, d.stageHeight * 0.29) : Math.min(390, d.stageHeight * 0.44)
      const compactW = (compactH * 720) / 1016
      const offsetY = (d.mobile ? d.stageHeight * 0.19 * settle : 20 * settle) + (1 - opening) * (d.mobile ? d.stageHeight * 0.21 : 45)
      const width = mix(mix(compactW, d.width, opening), w, shrink)
      tile.style.width = `${width}px`
      tile.style.height = `${mix(mix(compactH, d.stageHeight, opening), h, shrink)}px`
      const rounded = Math.max(1 - opening, shrink)
      tile.style.borderRadius = `${25 * rounded}px`
      tile.style.transform = `translate(-50%,-50%) translate3d(${x}px,${offsetY}px,0) rotateY(${-180 * turn}deg) rotateX(${Math.sin(turn * Math.PI) * 14}deg) rotateZ(${Math.sin(turn * Math.PI) * -11}deg)`
      tile.style.boxShadow = `0 ${rounded * 30}px ${rounded * 85}px rgba(0,0,0,${rounded * 0.18})`
      overlay.style.opacity = String(Math.max(1 - opening, phase(travel, 195, 300)))
      hero.dataset.opening = opening.toFixed(3)
      hero.dataset.fullscreen = width >= d.width * 0.92 ? "true" : "false"
      intro.style.color = width >= d.width * 0.8 ? "#fff" : "#191c1f"
      const fade = 1 - phase(travel, 140, 210)
      intro.style.opacity = String(fade)
      intro.style.transform = `translateY(${-80 * (1 - fade)}px)`
      intro.inert = fade < 0.08
      $(".scroll-cue").style.opacity = String(fade)
      $(".scroll-cue").style.color = intro.style.color
      const salaryFade = phase(travel, 390, 480)
      salary.style.opacity = String(salaryFade)
      salary.style.transform = `translateY(${d.mobile ? 24 * (1 - salaryFade) : -50 + 24 * (1 - salaryFade)}%)`
      salary.classList.toggle("is-visible", salaryFade > 0.5)
      salary.inert = salaryFade < 0.5
      const spread = phase(travel, 350, 470)
      ;[leftTile, rightTile].forEach((item: any, i: number) => {
        const direction = i ? 1 : -1
        const distance = (d.mobile ? w * 0.47 : w * 0.52) * spread
        item.style.width = `${w * 0.78}px`
        item.style.height = `${h * 0.78}px`
        item.style.opacity = String(spread)
        item.style.transform = `translate(-50%,-50%) translate3d(${x + direction * distance}px,${offsetY + 16}px,-90px) rotateY(${direction * -24}deg) rotateZ(${direction * 12 * spread}deg)`
      })
    }

    function cardsFrame(y: number) {
      const d = dimensions
      const p = clamp((y - d.cards.top) / Math.max(1, d.cards.height - d.cardHeight))
      cardStory.dataset.progress = p.toFixed(3)
      const rotation = (reduced.matches ? -12 : -p * 440 - 12) + renderedRotation
      const scale = d.mobile ? clamp((d.cardHeight - 360) / 540, 0.64, 1) : clamp((d.cardHeight - 410) / 470, 0.55, 1)
      ring.style.transform = `scale3d(${scale},${scale},${scale}) rotateX(${reduced.matches ? -12 : mix(-15, 12, p)}deg) rotateZ(${reduced.matches ? -7 : mix(-9, 9, p)}deg) rotateY(${rotation}deg)`
      paymentCards.forEach((card: any, index: number) => {
        const angle = ((rotation + (index * 360) / themes.length) * Math.PI) / 180
        card.style.setProperty("--shine", `${Math.sin(angle) * 35}%`)
      })
      const index = (((Math.round(-rotation / (360 / themes.length)) % themes.length) + themes.length) % themes.length)
      if (lastMaterial !== themes[index][1]) {
        lastMaterial = themes[index][1]
        $("#card-material").textContent = lastMaterial
      }
      if (!reduced.matches) {
        $(".wallet-phone").style.transform = `translate(-50%,-50%) rotateY(${mix(-20, 20, p)}deg) rotateX(${mix(10, -5, p)}deg) scale(${d.mobile ? 0.92 : 1})`
      }
    }

    function secondaryFrame(y: number) {
      const d = dimensions
      if (!reduced.matches) {
        const socialP = clamp((y - d.social.top + d.height) / (d.social.height + d.height))
        const distance = socialP * (d.mobile ? 410 : 580) * 3
        const wrapped = d.awardsSet ? distance % d.awardsSet : distance
        awards.style.transform = `translateX(${-wrapped}px)`
        const savingsP = clamp((y - d.savings.top + d.height) / (d.savings.height + d.height))
        $(".savings-backgrounds").style.transform = `translateY(${mix(-25, 25, savingsP)}px)`
        const airP = phase(clamp((y - d.air.top + d.height) / d.height), 0.08, 0.85)
        $(".air-demo").style.setProperty("--reveal", String(airP))
        $(".air-orb").style.transform = `translateY(${mix(40, -10, airP)}px) rotate(${mix(-25, 12, airP)}deg)`
        $(".user-bubble").style.transform = `translateY(${35 * (1 - airP)}px)`
        $(".assistant-bubble").style.transform = `translateY(${65 * (1 - airP)}px)`
        const securityP = clamp((y - d.security.top + d.height) / (d.security.height + d.height))
        $(".security-art").style.transform = `rotateY(${mix(-16, 20, securityP)}deg)`
        $(".orbit-one").style.transform = `translate(-50%,-50%) rotateX(65deg) rotateY(${mix(-20, 80, securityP)}deg)`
        const investP = clamp((y - d.invest.top + d.height) / (d.invest.height + d.height))
        document.querySelectorAll(".stock").forEach((stock: any, i: number) => {
          const direction = i % 2 ? 1 : -1
          stock.style.transform = `translateY(${mix(45, -45, investP) * direction}px) rotate(${mix(-10, 10, investP) * direction}deg)`
        })
      }
      const point = y + 44
      const inRange = (rect: any) => point >= rect.top && point < rect.top + rect.height
      const heroDark = point < d.hero.top + d.hero.height && (reduced.matches ? point < 620 : hero.dataset.fullscreen === "true")
      $("header").classList.toggle("on-light", !(heroDark || inRange(d.savings) || inRange(d.cards) || inRange(d.security) || inRange(d.closing)))
    }

    function draw() {
      frame = 0
      const targetY = scrollY
      if (reduced.matches) {
        renderedY = targetY
        renderedRotation = manualRotation
      } else {
        // Critically-damped-ish easing: rendered values chase their targets.
        renderedY += (targetY - renderedY) * 0.14
        renderedRotation += (manualRotation - renderedRotation) * 0.16
        if (Math.abs(targetY - renderedY) < 0.35) renderedY = targetY
        if (Math.abs(manualRotation - renderedRotation) < 0.02) renderedRotation = manualRotation
      }
      heroFrame(renderedY)
      cardsFrame(renderedY)
      secondaryFrame(renderedY)
      // Keep animating until both values have settled on their targets.
      if (renderedY !== targetY || renderedRotation !== manualRotation) {
        frame = requestAnimationFrame(draw)
      }
    }
    function requestDraw() {
      if (!frame) frame = requestAnimationFrame(draw)
    }
    function rotate(direction: number) {
      manualRotation += (direction * 360) / themes.length
      requestDraw()
    }

    document.querySelectorAll("[data-turn]").forEach((button: any) =>
      button.addEventListener("click", () => rotate(Number(button.dataset.turn)), { signal }))
    viewport.addEventListener("keydown", (event: any) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault()
        rotate(event.key === "ArrowLeft" ? -1 : 1)
      }
    }, { signal })
    viewport.addEventListener("pointerdown", (event: any) => {
      if (event.button !== 0) return
      dragStart = { x: event.clientX, rotation: manualRotation }
      viewport.setPointerCapture(event.pointerId)
    }, { signal })
    viewport.addEventListener("pointermove", (event: any) => {
      if (!dragStart) return
      manualRotation = dragStart.rotation + (event.clientX - dragStart.x) * 0.35
      requestDraw()
    }, { signal })
    const stopDrag = () => { dragStart = null }
    viewport.addEventListener("pointerup", stopDrag, { signal })
    viewport.addEventListener("pointercancel", stopDrag, { signal })

    document.querySelectorAll("[data-card-mode]").forEach((button: any) =>
      button.addEventListener("click", () => {
        const mode = button.dataset.cardMode
        cardStage.dataset.mode = mode
        document.querySelectorAll("[data-card-mode]").forEach((item: any) => {
          item.classList.toggle("selected", item === button)
          item.setAttribute("aria-pressed", String(item === button))
        })
        const virtual = mode === "virtual"
        $("#cards-title").textContent = virtual ? "Go virtual" : "Elevate your spend"
        $("#cards-description").innerHTML = virtual
          ? "Your next card is already in your pocket.<br>Make room for a lighter everyday."
          : "Everyday spending. Extraordinary possibilities.<br>Find a card that feels like you."
        $("#cards-cta").textContent = virtual ? "Create a card" : "Start earning"
        viewport.inert = virtual
        requestDraw()
      }, { signal }),
    )

    document.querySelectorAll('a[href="#salary"]').forEach((link: any) =>
      link.addEventListener("click", (event: any) => {
        event.preventDefault()
        const top = reduced.matches ? 720 : dimensions.hero.top + dimensions.hero.height - dimensions.stageHeight
        window.scrollTo({ top, behavior: reduced.matches ? "instant" : "smooth" })
        history.replaceState(null, "", "#salary")
      }, { signal }),
    )

    addEventListener("scroll", requestDraw, { passive: true, signal })
    addEventListener("resize", measure, { passive: true, signal })
    reduced.addEventListener("change", measure, { signal })
    document.fonts.ready.then(() => { if (!cancelled) measure() })
    measure()

    return () => {
      cancelled = true
      controller.abort()
      if (frame) cancelAnimationFrame(frame)
      // Remove DOM this effect created so a dev re-mount starts clean.
      paymentCards.forEach((card: any) => card.remove())
      awards.querySelectorAll("[data-clone]").forEach((clone: any) => clone.remove())
    }
  }, [])

  return null
}
