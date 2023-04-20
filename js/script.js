"use strict";

class SplitterApp {
  percentage;

  // DOM ELEMENTS
  form = document.querySelector(".inputs-form");
  percentageBtns = document.querySelector(".tip-percentages");
  resetBtn = document.querySelector(".reset-btn");
  tipResult = document.querySelector(".tip-result");
  totalResult = document.querySelector(".total-result");
  inputs = {
    bill: document.getElementById("bill"),
    percentage: document.getElementById("tip-custom"),
    people: document.getElementById("people"),
  };

  constructor() {
    this.form.setAttribute("novalidate", "novalidate");
    this.form.addEventListener("input", this.inputsCheck.bind(this));
    this.percentageBtns.addEventListener("click", this.inputBtns.bind(this));
    this.resetBtn.addEventListener("click", this.reset.bind(this));
  }

  inputsCheck() {
    let inputsGood = 0;
    let inputs = [];

    for (const [key, value] of Object.entries(this.inputs)) {
      const input = value.value;
      const regex = /^[0-9,.]+$/;
      let newInput = "";
      for (let i = 0; i < input.length; i++) {
        if (regex.test(input[i])) {
          newInput += input[i];
        }
      }
      value.value = newInput;

      if (input !== "" && +newInput > 0) {
        this.removeError(value);
        inputs.push(+newInput);
        inputsGood++;
      }

      if (key === "percentage" && value.value === "") {
        inputs.push(this.percentage);
        inputsGood++;
      }

      if (
        (key === "bill" || key === "people") &&
        (value.value === "" || value.value === "0")
      ) {
        this.showError(value, "Can't be zero!");
      }

      if (
        key === "percentage" &&
        (value.value === "" || value.value === "0") &&
        this.percentage === undefined
      ) {
        if (value.value === "0") {
          this.showError(value.parentElement, "Can't be zero!");
        } else {
          this.showError(value.parentElement, "Select a Tip %");
        }
      }
    }
    if (inputsGood === 3) {
      this.getResults(inputs);
    } else {
      this.reset("", true);
    }
  }

  inputBtns(e) {
    const target = e.target;
    if (target.id === "tip-custom") {
      this.removeActive();
      this.percentage = undefined;
      return;
    }
    if (!target.value) return;
    this.removeActive();

    target.classList.add("tip-btn--active");
    this.percentage = +target.dataset.tip;
    this.inputs.percentage.value = "";
    this.removeError(target.parentElement);
    this.inputsCheck();
  }

  removeActive() {
    Array.from(this.percentageBtns.children).forEach((btn) => {
      btn.classList.remove("tip-btn--active");
    });
  }

  getResults([bill, percentage, people]) {
    if (!percentage) {
      this.reset("", true);
      return;
    }
    const truePercentage = (percentage / 100).toFixed(4);
    const tip = (bill * truePercentage).toFixed(2);
    const tipPerPerson = (tip / people).toFixed(2);
    const totalPerPerson = ((bill * 10 + tip * 10) / 10 / people).toFixed(2);
    this.tipResult.textContent = tipPerPerson;
    this.totalResult.textContent = totalPerPerson;
    this.resetBtn.classList.add("reset-btn--completed");
  }

  showError(input, message) {
    const div = input.parentNode.closest("DIV");
    const formMessage = div.lastElementChild;
    div.classList.add("invalid-input");
    formMessage.textContent = message;
  }

  removeError(input) {
    const div = input.parentNode
      .closest("DIV")
      .classList.contains("tip-percentages")
      ? input.parentElement.parentElement
      : input.parentNode.closest("DIV");
    div.classList.remove("invalid-input");
  }

  reset(_, all) {
    if (!all) {
      for (const [key, value] of Object.entries(this.inputs)) {
        value.value = "";
      }
      this.removeActive();
      this.percentage = undefined;
    }
    this.tipResult.textContent = "0.00";
    this.totalResult.textContent = "0.00";
    this.resetBtn.classList.remove("reset-btn--completed");
  }
}

const app = new SplitterApp();
