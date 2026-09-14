import SiteMotion from "@/components/site-motion"

export default function Page() {
  return (
    <>
      <header>
        <nav aria-label="Main navigation">
          <a className="logo" href="#home">
            Revolut
          </a>
          <div className="navigation" id="navigation">
            <a href="#salary">Personal</a>
            <button data-action="business">Business</button>
            <button data-action="kids">Kids &amp; Teens</button>
            <a href="#about">Company</a>
          </div>
          <div className="account">
            <button data-action="login">Log in</button>
            <button className="pill dark" data-action="signup">
              Sign up
            </button>
            <button className="menu" aria-label="Toggle menu" aria-expanded="false" aria-controls="navigation">
              ☰
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero-story" id="home" aria-label="Banking and beyond">
          <div className="hero-stage">
            <div className="hero-copy">
              <h1>BANKING &amp; BEYOND</h1>
              <div className="hero-intro">
                <p>
                  This is your bank, redefined. Get powerful daily banking and global freedom. Sign up for free in a
                  tap.
                </p>
                <button className="pill light" data-action="signup">
                  Download the app
                </button>
              </div>
            </div>
            <div className="tile-space" aria-hidden="true">
              <div className="satellite satellite-left">
                <img src="/assets/salary-layer.png" alt="" />
              </div>
              <div className="satellite satellite-right">
                <img src="/assets/salary.png" alt="" />
              </div>
              <div className="account-tile">
                <div className="tile-face tile-front">
                  <img className="tile-sky" src="/assets/hero.png" alt="" />
                  <img className="tile-person" src="/assets/hero-person.png" alt="" />
                  <img className="tile-overlay" src="/assets/salary-back.png" alt="" />
                </div>
                <div className="tile-face tile-back">
                  <img src="/assets/salary.png" alt="" />
                </div>
              </div>
            </div>
            <div className="salary-copy" id="salary">
              <h2>
                Your salary,
                <br />
                reimagined
              </h2>
              <p>
                A little more freedom, every day. Bring your spending, saving, and everyday plans together in one place.
              </p>
              <button className="pill dark" data-action="salary">
                Move your salary
              </button>
            </div>
            <div className="scroll-cue" aria-hidden="true">
              <span>Scroll to explore</span>
              <span>↓</span>
            </div>
          </div>
        </section>

        <section className="social section" id="customers">
          <h2>
            Join 80+ million customers
            <br className="desktop-break" /> worldwide and 13 million
            <br className="desktop-break" /> in the UK
          </h2>
          <div className="awards-window">
            <div className="awards-track">
              <figure>
                <img src="/assets/award-downloads.png" width="185" height="85" alt="Finance app ranking" loading="lazy" />
                <figcaption>
                  #3 most downloaded
                  <br />
                  finance app
                </figcaption>
              </figure>
              <figure>
                <img src="/assets/award-trustpilot.png" width="185" height="85" alt="Trustpilot" loading="lazy" />
                <figcaption>
                  4.7 out of 5
                  <br />
                  on Trustpilot
                </figcaption>
              </figure>
              <figure>
                <img src="/assets/award-digital.png" width="185" height="85" alt="Global Finance 2025 award" loading="lazy" />
                <figcaption>
                  World’s Best
                  <br />
                  Digital Bank
                </figcaption>
              </figure>
              <figure>
                <img src="/assets/award-forbes.png" width="185" height="85" alt="Forbes award" loading="lazy" />
                <figcaption>
                  World’s Best
                  <br />
                  Banks List
                </figcaption>
              </figure>
              <figure>
                <img src="/assets/award-payments.png" width="185" height="85" alt="Payments award" loading="lazy" />
                <figcaption>
                  International Payments
                  <br />
                  Provider 2025
                </figcaption>
              </figure>
              <figure>
                <img src="/assets/award-service.png" width="185" height="85" alt="Customer satisfaction award" loading="lazy" />
                <figcaption>
                  Customer Satisfaction
                  <br />
                  Gold
                </figcaption>
              </figure>
              <figure>
                <img src="/assets/award-guardian.png" width="185" height="85" alt="Consumer Guardian 2025 award" loading="lazy" />
                <figcaption>
                  Consumer Guardian
                  <br />
                  2025
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="adventure" id="savings">
          <div className="savings-backgrounds" aria-hidden="true">
            <img className="savings-bg active" data-landscape="Adventure" src="/assets/savings-adventure.png" width="2400" height="1500" alt="" loading="lazy" />
            <img className="savings-bg" data-landscape="Wedding" src="/assets/savings-wedding.png" width="4320" height="2700" alt="" loading="lazy" />
            <img className="savings-bg" data-landscape="Moving" src="/assets/savings-moving.png" width="4320" height="2700" alt="" loading="lazy" />
          </div>
          <div className="section-copy">
            <h2>Life, meets savings</h2>
            <p>
              Big adventures start with small steps.
              <br />
              Make room for your next one.
            </p>
            <button className="pill light" data-action="savings">
              Explore Savings
            </button>
          </div>
          <div className="savings-ui">
            <img className="active" data-savings-ui="Adventure" src="/assets/savings.png" width="2000" height="1000" alt="Example adventure savings balance" loading="lazy" />
            <img data-savings-ui="Wedding" src="/assets/savings-wedding-ui.png" width="2000" height="1000" alt="Example wedding savings balance" loading="lazy" />
            <img data-savings-ui="Moving" src="/assets/savings-moving-ui.png" width="2000" height="1000" alt="Example moving savings balance" loading="lazy" />
          </div>
          <div className="choices" aria-label="Savings example">
            <button className="selected" aria-pressed="true" data-savings="Adventure">
              Adventure
            </button>
            <button aria-pressed="false" data-savings="Wedding">
              Wedding
            </button>
            <button aria-pressed="false" data-savings="Moving">
              Moving
            </button>
          </div>
          <p id="savings-caption" aria-live="polite">
            Save for your next adventure.
          </p>
        </section>

        <section className="card-story" id="cards" aria-label="Payment cards">
          <div className="card-stage" data-mode="physical">
            <div className="card-copy">
              <h2 id="cards-title">Elevate your spend</h2>
              <p id="cards-description">
                Everyday spending. Extraordinary possibilities.
                <br />
                Find a card that feels like you.
              </p>
              <button className="pill light" id="cards-cta" data-action="cards">
                Start earning
              </button>
            </div>
            <div className="cards-viewport" role="group" aria-label="Rotating card collection" tabIndex={0}>
              <div className="cards-ring" aria-hidden="true" />
              <div className="ring-shadow" aria-hidden="true" />
            </div>
            <div className="virtual-scene" aria-hidden="true">
              <div className="wallet-phone">
                <span className="phone-island" />
                <div className="wallet-heading">
                  Wallet <span>+</span>
                </div>
                <div className="wallet-card wallet-one">
                  Revolut<span>VISA</span>
                </div>
                <div className="wallet-card wallet-two">
                  Revolut<span>VISA</span>
                </div>
                <div className="wallet-card wallet-three">
                  Revolut<span>VISA</span>
                </div>
                <p>Ready when you are.</p>
              </div>
              <div className="virtual-float vf-one">
                Revolut<span>VISA</span>
              </div>
              <div className="virtual-float vf-two">
                Revolut<span>VISA</span>
              </div>
            </div>
            <div className="card-controls">
              <div className="rotation-controls">
                <button className="round-button" data-turn="-1" aria-label="Rotate cards left">
                  ←
                </button>
                <span id="card-material" aria-live="polite">
                  Platinum
                </span>
                <button className="round-button" data-turn="1" aria-label="Rotate cards right">
                  →
                </button>
              </div>
              <div className="choices" aria-label="Card type">
                <button data-card-mode="physical" className="selected" aria-pressed="true">
                  Physical cards
                </button>
                <button data-card-mode="virtual" aria-pressed="false">
                  Virtual cards
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="air-section section" id="air">
          <div className="section-copy">
            <span className="eyebrow">AI BY REVOLUT</span>
            <h2>
              A little help.
              <br />A lot of possibility.
            </h2>
            <p>From your next trip to your everyday plans. A conversation is all it takes.</p>
            <button className="pill dark" data-action="air">
              Meet AIR
            </button>
          </div>
          <div className="air-demo">
            <div className="air-orb" aria-hidden="true">
              ✳
            </div>
            <div className="chat-bubble user-bubble">How much did I spend on coffee?</div>
            <div className="chat-bubble assistant-bubble">
              Let’s take a look.
              <div className="coffee-chart">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <span>Your week, at a glance.</span>
            </div>
            <span className="example-label">Illustrative conversation</span>
          </div>
        </section>

        <section className="security-section section" id="security">
          <div className="security-art" aria-hidden="true">
            <div className="security-orbit orbit-one" />
            <div className="security-orbit orbit-two" />
            <div className="security-orbit orbit-three" />
            <div className="security-core">
              R<span>✓</span>
            </div>
          </div>
          <div className="section-copy">
            <span className="eyebrow">REVOLUT SECURE</span>
            <h2>
              Confidence.
              <br />
              Built in.
            </h2>
            <p>A space for your money, with control in your hands.</p>
            <button className="pill light" data-action="security">
              Explore security
            </button>
          </div>
        </section>

        <section className="invest-section section" id="invest">
          <div className="section-copy">
            <h2>
              A world
              <br />
              of opportunity.
            </h2>
            <p>
              Big ideas. Familiar names.
              <br />
              Explore what’s next.
            </p>
            <button className="pill dark" data-action="invest">
              Explore investing
            </button>
            <small>Illustrative preview. Capital at risk.</small>
          </div>
          <div className="stock-cloud" aria-hidden="true">
            <span className="stock stock-apple">AAPL</span>
            <span className="stock stock-google">
              <b>G</b>
              <small>Alphabet</small>
            </span>
            <span className="stock stock-nvidia">NVIDIA</span>
            <span className="stock stock-amazon">
              amazon<span>⌣</span>
            </span>
            <span className="stock stock-tesla">
              T<span>TESLA</span>
            </span>
            <span className="stock stock-meta">
              ∞<small>Meta</small>
            </span>
          </div>
        </section>

        <section className="closing section">
          <h2>
            Join the 80+ million
            <br />
            using Revolut
          </h2>
          <button className="pill light" data-action="signup">
            Get started
          </button>
        </section>
      </main>

      <footer id="about">
        <a className="logo" href="#home">
          Revolut
        </a>
        <div>
          <a href="#salary">Everyday banking</a>
          <a href="#savings">Savings</a>
          <a href="#cards">Cards</a>
        </div>
        <p>
          Local design reconstruction. Not affiliated with Revolut. Product screens show illustrative data. No banking
          services are provided.
        </p>
      </footer>

      <dialog id="action-dialog" aria-labelledby="dialog-title">
        <form method="dialog">
          <button className="close" aria-label="Close">
            ×
          </button>
          <h2 id="dialog-title">Local preview</h2>
          <p>This action is ready to connect to your own application. No data is collected or sent.</p>
          <button className="pill dark" id="dismiss">
            Got it
          </button>
        </form>
      </dialog>

      <SiteMotion />
    </>
  )
}
