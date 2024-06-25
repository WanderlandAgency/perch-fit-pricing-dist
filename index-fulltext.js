"use strict";

(() => {
  /**
   * Selectors
   */
  const professionalPlan = "Professional";
  let maxQuantity = 10;
  const defaultCountry = "United States (US)";
  const dataPrefix = "pp";
  const highlightedClass = "cc-highlighted";
  const dataSelector = (e) => `[${dataPrefix}='${e}']`;
  let section1 = query(document.body, dataSelector("section-1"));
  let section2 = query(document.body, dataSelector("section-2"));
  let preloader = query(document.body, dataSelector("preloader"));
  let quantityCounter = query(document.body, dataSelector("quantity-counter"));
  let quantityCounterButtons = queryAll(
    section2,
    dataSelector("quantity-counter-button")
  );
  let quantityDisplays = queryAll(section2, dataSelector("quantity-display"));
  let selectedPlanDisplays = queryAll(
    section2,
    dataSelector("selected-plan-display")
  );
  let planCardWrappers = queryAll(section2, dataSelector("plan-card-wrapper"));
  let radioInputs = planCardWrappers.flatMap((wrapper) =>
    queryAll(wrapper, "input[type='radio']")
  );
  let emailSource = query(section1, dataSelector("email-source"));
  let emailTarget = query(section2, dataSelector("email-target"));
  let pricingQuoteTabs = query(section2, dataSelector("pricing-quote-tabs"));
  let tabMenu = query(pricingQuoteTabs, ".w-tab-menu");
  let upfrontCostDisplay = section2.querySelectorAll(
    dataSelector("cash-upfront-cost")
  );
  let recurringAnnualCostDisplay = section2.querySelectorAll(
    dataSelector("cash-recurring-annual-cost")
  );

  let year1TotalDisplay = section2.querySelectorAll(
    dataSelector("cash-year-1-total")
  );
  let haasRecurringAnnualCostDisplay = section2.querySelectorAll(
    dataSelector("haas-recurring-annual-cost")
  );
  let grandTotalCostDisplayHaas = section2.querySelectorAll(
    dataSelector("grand-total-cost-haas")
  );
  let grandTotalCostDisplayCash = section2.querySelectorAll(
    dataSelector("grand-total-cost-cash")
  );
  let grandTotalCostLabel = section2.querySelectorAll(
    dataSelector("grand-total-cost-label")
  );
  let customPricingTag = section2.querySelectorAll(
    dataSelector("custom-pricing-tag")
  );
  let costSummaryWraps = queryAll(section2, dataSelector("cost-summary-wrap"));
  let customPricingTooltipQuantity = query(
    section2,
    dataSelector("custom-pricing-tooltip-quantity")
  );
  let customPricingTooltipPlan = query(
    section2,
    dataSelector("custom-pricing-tooltip-plan")
  );
  let countrySelect = query(section1, dataSelector("country-select"));
  let stateSelect = query(section1, dataSelector("us-state-select"));

  /**
   * FUNCTIONS
   */

  /**
   * Get the value of the checked radio button with the specified name.
   * @param {HTMLElement} container - The container element to search within.
   * @param {string} name - The name attribute of the radio buttons.
   * @returns {string|null} - The value of the checked radio button, or null if none is checked.
   */
  function getCheckedRadioValue(container, name) {
    const selectedRadio = Array.from(
      container.querySelectorAll(`input[type='radio'][name='${name}']`)
    ).find((radio) => radio.checked);
    return selectedRadio?.value || null;
  }

  /**
   * Get all elements that match the specified selector within the given container.
   * @param {HTMLElement} container - The container element to search within.
   * @param {string} selector - The CSS selector to match elements against.
   * @returns {Array<HTMLElement>} - An array of elements that match the selector.
   */
  function queryAll(container, selector) {
    return Array.from(container.querySelectorAll(selector));
  }

  /**
   * Get the first element that matches the specified selector within the given container.
   * @param {HTMLElement} container - The container element to search within.
   * @param {string} selector - The CSS selector to match elements against.
   * @returns {HTMLElement|null} - The first element that matches the selector, or null if no match is found.
   */
  function query(container, selector) {
    return container.querySelector(selector);
  }

  /**
   * Delay the execution of code by the specified number of milliseconds.
   * @param {number} ms - The number of milliseconds to delay.
   * @returns {Promise<void>} - A promise that resolves after the delay.
   */
  async function delay(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    });
  }

  /**
   * Remove the specified prefix from the given text.
   * @param {string} text - The text to remove the prefix from.
   * @param {string} prefix - The prefix to remove.
   * @returns {string} - The text without the prefix.
   */
  function removePrefix(text, prefix) {
    return text.startsWith(prefix) ? text.substring(prefix.length) : text;
  }

  /**
   * Compare two strings ignoring case sensitivity.
   * @param {string} text1 - The first string to compare.
   * @param {string} text2 - The second string to compare.
   * @returns {boolean} - True if the strings are equal (ignoring case), false otherwise.
   */
  function compareIgnoreCase(text1, text2) {
    return text1.toLowerCase() === text2.toLowerCase();
  }

  /**
   * Format a numeric value as a currency string.
   * @param {number} value - The numeric value to format.
   * @returns {string} - The formatted currency string.
   */
  function formatCurrency(value) {
    return `$${value.toLocaleString("en-US")}`;
  }

  /**
   * Get the current active tab within the specified container.
   * @param {HTMLElement} container - The container element to search within.
   * @returns {string} - The ID of the current active tab, or an empty string if no tab is active.
   */
  function getCurrentTab(container) {
    const currentTab = Array.from(
      container.querySelectorAll("[data-w-tab]")
    ).find((tab) => tab.classList.contains("w--current"));
    return currentTab?.getAttribute("data-w-tab")?.trim() || "";
  }

  /**
   * Get the details of the selected plan within the specified container.
   * @param {HTMLElement} container - The container element to search within.
   * @returns {Object} - An object containing the plan name and price by quantity.
   * @throws {Error} - If the plan name cannot be found.
   */
  function getPlanDetails(container) {
    const planNameElement = query(
      container,
      "[pp='plan-name']"
    )?.innerText.trim();
    if (!planNameElement) throw new Error("could not find plan name");
    const priceMap = new Map();
    queryAll(container, "[data-pp-quantity]").forEach((item) => {
      const quantity = Number(item.getAttribute("data-pp-quantity"));
      const price = Number(item.getAttribute("data-pp-price"));
      priceMap.set(quantity, price);
    });
    return { planName: planNameElement, priceByQuantity: priceMap };
  }

  /**
   * Calculate the hardware cost based on the selected hardware items within the specified container.
   * @param {HTMLElement} container - The container element to search within.
   * @returns {Object} - An object containing the hardware cost in cash and HaaS (Hardware as a Service) pricing.
   */
  function calculateHardwareCost(container) {
    const grandTotalData = {
      hardware_cash: 0,
      hardware_haas: 0,
    };
    queryAll(container, "[pp='hardware-item']").forEach((item) => {
      const checkbox = item.querySelector(
        "[pp='hardware-toggle-wrap'] input[type='checkbox']"
      );
      if (checkbox && checkbox.checked) {
        ["cash", "haas"].forEach((type) => {
          const priceElement = query(item, `[pp='hardware-price-${type}']`);
          const priceText = priceElement?.innerText.trim() || "";
          const numericPrice = Number(
            removePrefix(priceText, "$").trim().replace(/,/g, "")
          );
          grandTotalData[`hardware_${type}`] += numericPrice;
        });
      }
    });
    return grandTotalData;
  }

  /**
   * Get the current active tab within the specified container and convert it to lowercase.
   * @param {HTMLElement} container - The container element to search within.
   * @returns {string} - The lowercase ID of the current active tab, or an empty string if no tab is active.
   */
  function getLowerCaseCurrentTab(container) {
    return getCurrentTab(container).toLowerCase();
  }

  countrySelect.value = defaultCountry;
  countrySelect == null ||
    countrySelect.addEventListener("change", () => {
      countrySelect.value === defaultCountry
        ? (stateSelect.style.display = "block")
        : (stateSelect.style.display = "none");
    });

  queryAll(section2, "[fs-accordion-element='content']").forEach(
    async (element) => {
      await delay(500);
      let group = element.closest("[fs-accordion-element='group']");
      let activeClass =
        group == null ? void 0 : group.getAttribute("fs-accordion-active");
      if (activeClass && element.classList.contains(activeClass)) {
        element.style.maxHeight = "none";
      }
    }
  );

  if (!location.search.includes("show-both-forms")) {
    section2.style.display = "none";
  }

  section1.addEventListener("submit", async () => {
    preloader.style.display = "flex";
    section1.style.display = "none";
    section2.style.display = "block";
    window.scrollTo(0, 0);
    await delay(2500);
    preloader.style.display = "none";
    emailTarget.value = emailSource.value;
  });

  var toggleButtons = queryAll(section2, ".c-toggle__button");
  toggleButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      var hardwareItem, hardwareNameElement, hardwareName;
      if (button.hasAttribute("readonly")) {
        event.preventDefault();
        return;
      }
      ((hardwareItem = button.closest(dataSelector("hardware-item"))) == null
        ? void 0
        : hardwareItem.querySelector(".c-toggle__text")
      ).classList.toggle("cc-active");
      hardwareName =
        (hardwareNameElement = button.closest(dataSelector("hardware-item"))) ==
        null
          ? void 0
          : hardwareNameElement.querySelector(dataSelector("hardware-name"));
      let hardwareNameText =
        (hardwareName == null ? void 0 : hardwareName.innerText) != null
          ? hardwareName
          : "";
      queryAll(section2, dataSelector("pricing-hardware-item"))
        .filter((item) => {
          var itemNameElement, itemName;
          itemName =
            (itemNameElement = item.querySelector(
              dataSelector("hardware-name")
            )) == null
              ? void 0
              : itemNameElement.innerHTML;
          return compareIgnoreCase(itemName, hardwareNameText);
        })
        .forEach((item) => {
          button.checked
            ? item == null || item.classList.add("cc-active")
            : item == null || item.classList.remove("cc-active");
        });
    });
  });

  quantityCounterButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      await delay(0);
      let count = quantityCounter.value;
      quantityDisplays.forEach((display) => (display.innerText = count));
      updateDisplays();
    });
  });

  radioInputs.forEach((input) => {
    let wrapper = input.closest(dataSelector("plan-card-wrapper"));
    if (wrapper) {
      if (input.value === professionalPlan && input.checked) {
        highlight(wrapper);
        selectedPlanDisplays.forEach(
          (display) => (display.innerText = input.value)
        );
      }
      input.addEventListener("change", () => {
        highlight(wrapper);
        selectedPlanDisplays.forEach(
          (display) => (display.innerText = input.value)
        );
      });
    }
  });

  /**
   * Highlight the specified element by adding a CSS class to its children.
   * @param {HTMLElement} element - The element to highlight.
   */
  function highlight(element) {
    planCardWrappers.forEach((wrapper) => {
      for (let child of wrapper.children) {
        child.classList.remove(highlightedClass);
      }
    });
    for (let child of element.children) {
      child.classList.add(highlightedClass);
    }
  }

  toggleButtons.forEach((button) =>
    button.addEventListener("click", updateDisplays)
  );
  tabMenu == null || tabMenu.addEventListener("click", updateDisplays);
  radioInputs.forEach((input) =>
    input.addEventListener("change", updateDisplays)
  );

  /**
   * Updates the displays based on the selected plan and quantity.
   * If the selected plan is not "Standard" or the quantity exceeds the maximum quantity,
   * custom pricing will be shown. Otherwise, the displays will be reset and updated
   * with the calculated costs.
   */
  function updateDisplays() {
    if (!pricingQuoteTabs) {
      return;
    }
    const selectedPlan = getCheckedRadioValue(
      section2,
      "desired_subscription_plans"
    );
    if (selectedPlan !== "Standard") {
      toggleCustomPricing("plan");
      return;
    }
    const quantity = Number(quantityDisplays[0].innerText);
    if (quantity > maxQuantity) {
      toggleCustomPricing("quantity");
      return;
    }
    resetDisplays();
    const currentTab = getLowerCaseCurrentTab(pricingQuoteTabs);
    const selectedPlanWrapper = document
      .querySelector(`input[type='radio'][value='${selectedPlan}']`)
      ?.closest(dataSelector("plan-card-wrapper"));
    if (!selectedPlanWrapper) {
      throw new Error("no selected plan card wrapper");
    }
    const costs = calculateHardwareCost(section2);
    const haasCost = costs.hardware_haas * quantity;
    const cashCost = costs.hardware_cash * quantity;

    const softwareCost =
      getPlanDetails(selectedPlanWrapper).priceByQuantity.get(quantity);
    if (!softwareCost) {
      throw new Error("no software cost found");
    }
    const totalHaasCost = softwareCost + haasCost;
    const totalCashCost = softwareCost + cashCost;

    const finalCost = currentTab === "haas" ? totalHaasCost : totalCashCost;

    if (finalCost > 15000) {
      toggleCustomPricing("quantity");
      return;
    }
    upfrontCostDisplay.forEach((item) => {
      item.innerText = formatCurrency(cashCost);
    });
    recurringAnnualCostDisplay.forEach((item) => {
      item.innerText = formatCurrency(softwareCost);
    });
    year1TotalDisplay.forEach((item) => {
      item.innerText = formatCurrency(softwareCost + cashCost);
    });
    haasRecurringAnnualCostDisplay.forEach((item) => {
      item.innerText = formatCurrency(softwareCost + haasCost);
    });

    grandTotalCostDisplayHaas.forEach((item) => {
      item.innerText = formatCurrency(totalHaasCost);
    });
    grandTotalCostDisplayCash.forEach((item) => {
      item.innerText = formatCurrency(totalCashCost);
    });
  }

  /**
   * Shows custom pricing based on the given reason.
   * @param {string} reason - The reason for showing custom pricing. Possible values are "plan" or "quantity".
   */
  function toggleCustomPricing(reason) {
    costSummaryWraps.forEach((wrap) => (wrap.style.display = "none"));
    grandTotalCostLabel.forEach((label) => (label.style.display = "none"));
    grandTotalCostDisplayHaas.forEach((item) => (item.style.display = "none"));
    grandTotalCostDisplayCash.forEach((item) => (item.style.display = "none"));
    customPricingTag.forEach((tag) => (tag.style.display = "flex"));

    if (reason === "plan") {
      customPricingTooltipPlan.style.display = "block";
      customPricingTooltipQuantity.style.display = "none";
    } else if (reason === "quantity") {
      customPricingTooltipPlan.style.display = "none";
      customPricingTooltipQuantity.style.display = "block";
    }
  }

  /**
   * Resets the displays of various elements on the page.
   */
  function resetDisplays() {
    costSummaryWraps.forEach((wrap) => (wrap.style.display = "block"));
    grandTotalCostLabel.forEach((label) => (label.style.display = "block"));
    grandTotalCostDisplayHaas.forEach((item) => (item.style.display = "block"));
    grandTotalCostDisplayCash.forEach((item) => (item.style.display = "block"));
    customPricingTag.forEach((tag) => (tag.style.display = "none"));
  }
})();
