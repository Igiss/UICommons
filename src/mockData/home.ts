export const elementsMock = [
  {
    id: 1,
    title: "Fancy Button",
    html: "<button class='btn'>Click Me</button>",
    css: ".btn { background: blue; color: white; padding: 10px 20px; border-radius: 8px; cursor: pointer; }",
    reactCode:
      "export default function Btn(){ return <button>Click Me</button> }",
  },

  {
    id: 2,
    title: "Cool Card",
    html: "<div class='card'>Card content</div>",
    css: ".card { padding:20px; border:1px solid #ddd; border-radius:8px; }",
    reactCode:
      "export default function Card(){ return <div>Card content</div> }",
  },
  {
    id: 3,
    title: "button-border",
    html: `
    <div class="button">
      Button
      <span class="button-border"></span>
    </div>
  `,
    css: `
    .button {
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      border: none;
      font-size: 1rem;
      font-weight: 500;
      color: #f4f0ff;
      text-align: center;
      position: relative;
      cursor: pointer;
      background: transparent;
      z-index: 1;
    }

    .button::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 0.5rem;
      background: linear-gradient(
          180deg,
          rgba(8, 77, 126, 0) 0%,
          rgba(8, 77, 126, 0.42) 100%
        ),
        rgba(47, 255, 255, 0.24);
      box-shadow: inset 0 0 12px rgba(151, 200, 255, 0.44);
      z-index: -1;
    }

    .button::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 0.5rem;
      background: linear-gradient(
          180deg,
          rgba(8, 77, 126, 0) 0%,
          rgba(8, 77, 126, 0.42) 100%
        ),
        rgba(47, 255, 255, 0.24);
      box-shadow: inset 0 0 12px rgba(151, 200, 255, 0.44);
      opacity: 0;
      transition: all 0.3s ease-in;
      z-index: -1;
    }

    .button:hover::after {
      opacity: 1;
    }

    .button-border {
      position: absolute;
      inset: 0;
      border-radius: 0.5rem;
      z-index: -1;
    }

    .button-border::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 0.5rem;
      padding: 1px;
      background: linear-gradient(
          180deg,
          rgba(184, 238, 255, 0.24) 0%,
          rgba(184, 238, 255, 0) 100%
        ),
        linear-gradient(
          0deg,
          rgba(184, 238, 255, 0.32),
          rgba(184, 238, 255, 0.32)
        );
      -webkit-mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      pointer-events: none;
    }
  `,
    reactCode: `
    export default function ButtonBorder() {
      return (
        <div className="button">
          Button
          <span className="button-border"></span>
        </div>
      );
    }
  `,
  },
];
