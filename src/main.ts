const CATEGORIES = {
  MARKETING: "Marketing",
  MANAGEMENT: "Management",
  HR: "HR & Recruiting",
  DESIGN: "Design",
  DEVELOPMENT: "Development",
} as const;

type Card = {
  category: (typeof CATEGORIES)[keyof typeof CATEGORIES];
  title: string;
  price_usd: number;
  author: string;
  badge_color: "green" | "danger" | "blue" | "orange" | "purple" | "red";
  picture: number;
};

const CARDS_DATA: readonly Card[] = [
  {
    category: CATEGORIES.MARKETING,
    title: "The Ultimate Google Ads Training Course",
    price_usd: 100,
    author: "Jerome Bell",
    badge_color: "green",
    picture: 1,
  },
  {
    category: CATEGORIES.MANAGEMENT,
    title: "Product Management Fundamentals",
    price_usd: 480,
    author: "Marvin McKinney",
    badge_color: "orange",
    picture: 2,
  },
  {
    category: CATEGORIES.HR,
    title: "HR Management and Analytics",
    price_usd: 200,
    author: "Leslie Alexander Li",
    badge_color: "purple",
    picture: 3,
  },
  {
    category: CATEGORIES.MARKETING,
    title: "Brand Management & PR Communications",
    price_usd: 530,
    author: "Kristin Watson",
    badge_color: "green",
    picture: 4,
  },
  {
    category: CATEGORIES.DESIGN,
    title: "Graphic Design Basic",
    price_usd: 500,
    author: "Guy Hawkins",
    badge_color: "blue",
    picture: 5,
  },
  {
    category: CATEGORIES.MANAGEMENT,
    title: "Business Development Management",
    price_usd: 400,
    author: "Dianne Russell",
    badge_color: "orange",
    picture: 6,
  },
  {
    category: CATEGORIES.DEVELOPMENT,
    title: "Highload Software Architecture",
    price_usd: 600,
    author: "Brooklyn Simmons",
    badge_color: "red",
    picture: 7,
  },
  {
    category: CATEGORIES.HR,
    title: "Human Resources – Selection and Recruitment",
    price_usd: 150,
    author: "Kathryn Murphy",
    badge_color: "purple",
    picture: 8,
  },
  {
    category: CATEGORIES.DESIGN,
    title: "User Experience. Human-centered Design",
    price_usd: 240,
    author: "Cody Fisher",
    badge_color: "blue",
    picture: 9,
  },
] as const;

interface GetCardByCategoryParams {
  category: keyof typeof CATEGORIES | null;
}

class CardsManager {
  static getHTMLForCards(cards: readonly Card[] | Card[]) {
    return cards.map(
      ({ author, category, price_usd, title, badge_color, picture }) => {
        const container = document.createElement("div");
        container.classList.add("card");
        container.innerHTML = `
        <div class="card__bg" data-picture="${picture}"></div>
        <div class="card__content">
          <p class="text card__badge card__badge--${badge_color}">${category}</p>
            <h6 class="text text--bold">
            ${title}
            </h6>
            <p class="text">
            <span class="card__price text--danger">$${price_usd}</span>
            <span class="card__author text--regular">| by ${author}</span>
          </p>
        </div>
        `;
        return container;
      }
    );
  }

  static getCardsByCategory = ({ category }: GetCardByCategoryParams) => {
    const cards =
      typeof category === "string"
        ? CARDS_DATA.filter((card) => card.category === CATEGORIES[category])
        : CARDS_DATA;
    return CardsManager.getHTMLForCards(cards);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const tabsElement = document.getElementById("tabs")!;
  const cardsElement = document.getElementById("cards")!;
  const searchElement = document.getElementById(
    "search__input"
  )! as HTMLInputElement;
  const loadElement = document.getElementById(
    "load_button"
  )! as HTMLButtonElement;

  let cardNodes = cardsElement.innerHTML;

  tabsElement.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const clickedTab = target.closest(".tab") as HTMLButtonElement;

    if (!clickedTab || !tabsElement.contains(clickedTab)) return;

    document
      .querySelectorAll(".tab--active, .tab__text--active")
      .forEach((el) => {
        el.classList.remove("tab--active", "tab__text--active");
      });

    clickedTab.classList.add("tab--active");
    const tabText = clickedTab.querySelector(".tab__text");
    if (tabText) {
      tabText.classList.add("tab__text--active");
    }

    const category = clickedTab.getAttribute(
      "data-category"
    ) as keyof typeof CATEGORIES;

    cardsElement.replaceChildren(
      ...CardsManager.getCardsByCategory({ category })
    );
    cardNodes = cardsElement.innerHTML;
  });

  searchElement.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;

    const cards = CARDS_DATA.filter(({ title, author, category }) =>
      [title, author, category].some((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      )
    );

    cardsElement.replaceChildren(...CardsManager.getHTMLForCards(cards));
    cardNodes = cardsElement.innerHTML;
  });

  loadElement.addEventListener("click", () => {
    cardsElement.innerHTML += cardNodes;
  });
});
