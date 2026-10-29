
export default function decorate(block) {
  const navItems = [
    {
      label: "Products",
      links: [
        { label: "Product Overview", href: "/products/overview" },
        { label: "Product Features", href: "/products/features" },
      ],
    },
    {
      label: "Solutions",
      links: [
        { label: "For Businesses", href: "/solutions/businesses" },
        { label: "For Developers", href: "/solutions/developers" },
      ],
    },
    {
      label: "Resources",
      links: [
        { label: "Documentation", href: "/resources/documentation" },
        { label: "Blog", href: "/resources/blog" },
      ],
    },
  ];

  const nav = document.createElement("nav");
  nav.className = "navbar-inner";
  nav.setAttribute("aria-label", "Main navigation");

  // Brand on the left
  const brand = document.createElement("a");
  brand.className = "navbar-brand";
  brand.href = "/";
  brand.textContent = "YourBrand";

  const menu = document.createElement("ul");
  menu.className = "navbar-menu";

  navItems.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.className = "navbar-item";

    const dropdownId = `navbar-dropdown-${index}`;

    const toggle = document.createElement("button");
    toggle.className = "navbar-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", dropdownId);

    const label = document.createElement("span");
    label.textContent = item.label;

    const arrow = document.createElement("span");
    arrow.className = "navbar-arrow";
    arrow.setAttribute("aria-hidden", "true");

    toggle.append(label, arrow);

    const dropdown = document.createElement("ul");
    dropdown.className = "navbar-dropdown";
    dropdown.id = dropdownId;
    dropdown.hidden = true;

    item.links.forEach((link) => {
      const subItem = document.createElement("li");
      const anchor = document.createElement("a");

      anchor.href = link.href;
      anchor.textContent = link.label;

      subItem.append(anchor);
      dropdown.append(subItem);
    });

    listItem.append(toggle, dropdown);
    menu.append(listItem);
  });

  // Search icon on the right
  const searchButton = document.createElement("button");
  searchButton.className = "navbar-search";
  searchButton.type = "button";
  searchButton.setAttribute("aria-label", "Open search");

  searchButton.innerHTML = `
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="10.8" cy="10.8" r="6.8"></circle>
      <path d="m16 16 5 5"></path>
    </svg>
  `;

  const searchForm = document.createElement("form");
  searchForm.className = "navbar-search-form";
  searchForm.hidden = true;
  searchForm.setAttribute("role", "search");

  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.name = "q";
  searchInput.placeholder = "Search...";
  searchInput.setAttribute("aria-label", "Search website");

  const searchSubmit = document.createElement("button");
  searchSubmit.type = "submit";
  searchSubmit.textContent = "Go";

  searchForm.append(searchInput, searchSubmit);

  const actions = document.createElement("div");
  actions.className = "navbar-actions";
  actions.append(searchButton, searchForm);

  nav.append(brand, menu, actions);

  // Replace the block's authored content with the navbar
  block.replaceChildren(nav);

  // Dropdown interactions
  const closeDropdowns = (except = null) => {
    menu.querySelectorAll(".navbar-item").forEach((item) => {
      if (item === except) return;

      const button = item.querySelector(".navbar-toggle");
      const dropdown = item.querySelector(".navbar-dropdown");

      button.setAttribute("aria-expanded", "false");
      dropdown.hidden = true;
      item.classList.remove("is-open");
    });
  };

  menu.querySelectorAll(".navbar-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".navbar-item");
      const dropdown = item.querySelector(".navbar-dropdown");
      const isOpen = button.getAttribute("aria-expanded") === "true";

      closeDropdowns();

      if (!isOpen) {
        button.setAttribute("aria-expanded", "true");
        dropdown.hidden = false;
        item.classList.add("is-open");
      }
    });
  });

  // Close dropdowns when clicking outside the navbar
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) {
      closeDropdowns();
    }
  });

  // Close dropdowns with Escape
  nav.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdowns();
      searchForm.hidden = true;
      searchButton.setAttribute("aria-expanded", "false");
      searchButton.focus();
    }
  });

  // Search form toggle
  searchButton.setAttribute("aria-expanded", "false");

  searchButton.addEventListener("click", () => {
    const opening = searchForm.hidden;

    searchForm.hidden = !opening;
    searchButton.setAttribute("aria-expanded", String(opening));

    if (opening) {
      searchInput.focus();
    }
  });

  // Example search behavior: redirect to the site's search page
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  });
}
