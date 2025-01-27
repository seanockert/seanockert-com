<template>
  <div :data-id="name" id="department" v-shortkey="['meta', 'c']" @shortkey="copyEmail()" class="department">
    <!-- Only show if the route exists -->
    <div v-if="departmentExists">
    
    <!-- Notification on copy -->
    <div @click="copied = ''" :class="[{ copied: copied }, 'toast']">Copied to clipboard!</div>
    
    <!-- Floating action button -->
    <div class="actions" data-tooltip="Keyboard shortcut: CMD+C (Mac), CTRL+C (Windows)">
      <button type="button"
      title="Click to copy email. Or use keyboard shortcut: CMD+C (Mac), CTRL+C (Windows)"
      @click="copyEmail" 
      >Copy text</button>
    </div>
    
    <div class="container">

      <!-- Sidebar with options to toggle. TODO: move to separate component -->
      <aside class="sidebar">
        <h1>
          <select @change="changeRoute($event.target.value)">
            <option disabled selected>Change department</option><!--:selected="dept == name"-->
            <option v-for="(dept, key) in departments" :value="dept" :key="key" :selected="dept == name">{{ dept|capitalize }}</option>
          </select>
          <strong>Email Content <br>Generator</strong>
          <button @click="updateActive = !updateActive;" title="View updates to this generator">
            <span v-if="updateActive">Hide</span><span v-else>View</span> updates
          </button>
        </h1>

        <!-- Only show on small screens -->
        <ul class="no-list section-padded hidden-large">
          <li v-for="(contact, key) in contacts" :key="key">
            <label>{{ contact.label }}</label>
            <input type="text" v-model="contact.value" @focus="$event.target.select()">
          </li>
        </ul>

        <div class="skeleton" v-if="loading">
          <div class="skeleton-option"></div>
          <div class="skeleton-option"></div>
          <div class="skeleton-option"></div>
        </div>

        <div v-else>
        <!-- Options for toggling sections -->
        <div v-for="(section, key) in parsedSections" class="section" :key="key">
          <h3>{{ section.label }}</h3>
          <ul class="no-list">
            <li v-for="option in section.options" :key="option.name">
              <label :class="{ active: option.active }">
                <input :type="section.type" :name="section.name" v-if="section.type == 'radio'" @change="changeRadio(section, option)" :checked="option.active == true">
                <input :type="section.type" v-model="option.active" :name="section.name" v-else> 
                {{ option.label }}
              </label> 
            </li>
          </ul>
        </div>

        <footer><span>by Seano</span>&nbsp;&nbsp;&nbsp;<a href="request.html" title="Request updates and changes to this email generator" class="hidden-large" target="_blank">Request a feature</a></footer>
        </div>
      </aside>
      
      <!-- Output the active sections. TODO: move to separate component -->
      <main class="content" ref="content">
        <div class="skeleton" v-if="loading">
          <div class="skeleton-option"></div>
          <div class="skeleton-option"></div>
          <div class="skeleton-option"></div>
        </div>

        <div v-else>
          <!-- Show list of recent updates in an overlay -->
          <transition name="fade" mode="out-in">
            <div class="updates" v-show="updateActive">
              <h3>Updates</h3>
              <ul class="no-list">
                <li v-for="(update, key) in updates" :key="key">
                  <strong>{{ update.date }}</strong>
                  <ul>
                    <li v-for="(item, key) in update.items" :key="key">{{ item }}</li>
                  </ul>  
                </li>
              </ul> 

              <button @click="updateActive = !updateActive" title="Hide updates">Close overlay</button>
            </div>
          </transition>
          
          <!-- Hide on small screens -->
          <ul class="no-list content-inputs hidden-small">
            <li v-for="(contact, key) in contacts" :key="key">
              <label :for="contact.name">{{ contact.label }}</label>
              <input type="text" :id="contact.name" v-model="contact.value" @focus="$event.target.select()">
            </li>
          </ul>
          
          <div v-if="sorted.length < 2" class="helper">
            <img src="src/assets/arrow-left.png" alt="<">
            <div><ol>
              <li>Build your email content, section by section.</li>
              <li>Drag sections to re-arrange (scroll for more).</li>
              <li>Copy text, then paste into your email client.</li>
            </ol></div>
          </div>

          <!-- Main email sections -->
          <!-- Allow drag and drop reordering with dragula -->
          <transition-group name="highlight" tag="ul" class="no-list" v-dragula="" drake="columns" v-for="(section, i) in parsedSections" :key="i" mode="out-in">
            <li v-for="(option, j) in section.options" v-if="option.active == true" class="item" :key="j" :data-section="i" :data-option="j" title="Hold and drag to reorder">
              <span v-if="option.content.length > 0 && option.type != 'textarea'">
                <button @click="option.active = !option.active" class="button-close" title="Remove this section">&times;</button>
                <small class="item-type hidden-small">{{ option.label }}</small>
                <div v-html="option.content"></div>
              </span>
              <span v-else>
                <!-- Free text area for custom section -->
                <textarea v-model="option.content"></textarea>
              </span>
            </li>
          </transition-group>
        </div>
      </main>

      </div>
    </div>
    
    <div v-else class="missing">Woops, this department doesn't exist. <a href="">Return home</a></div>
  </div>
</template>

<script>
// Debounce input changes
const debounce = require("lodash.debounce");

//import jsonData from '../' + dataUrl;

export default {
  name: "department",
  data() {
    return {
      name: this.$route.params.department,
      sections: [],
      parsedSections: [],
      contacts: [],
      updates: [],
      sorted: [],
      copied: "",
      departments: [
        "customer-success",
        "marketing",
        "onboarding",
        "sales"
      ],
      departmentExists: true,
      updateActive: false,
      loading: false
    };
  },
  created: function() {
    this.init();

    // Dragula drag and drop events
    const service = this.$dragula.$service;
    service.options("drop-service", {
      direction: "vertical"
    });

    service.eventBus.$on("drop", args => {
      this.dropped(args);
    });
  },
  watch: {
    // For updating contact values
    contacts: {
      handler: function(newValue) {
        this.updateContact();
      },
      deep: true
    },
    // Deep watch on parsedSections object changes
    parsedSections: {
      handler: function(newValue) {
        this.changeSections();
      },
      deep: true
    },
    "$route.params.department": function(department) {
      this.init();
    }
  },
  computed: {
    selectedDept: {
      get() {
        return null;
      },
      set(optionValue) {
        this.changeRoute(optionValue);
      }
    }
  },
  methods: {
    init: function() {
      const routeName = this.$route.params.department;
      let dataFile = "content";

      if (routeName) {
        this.name = routeName;
        dataFile += "-" + routeName;
        document.title =
          "Email Generator for " +
          this.$options.filters.capitalize(routeName) +
          " | Neto";
      } else {
        this.name = "";
      }

      this.loading = true;

      this.$http.get("content/" + dataFile + ".json").then(
        response => {
          // Prefill section options, contact variables, and updates list from JSON file
          this.sections = response.body.sections;
          this.contacts = response.body.contacts;
          this.updates = response.body.updates;

          // Duplicate the array but keep the original for any variable changes
          this.parsedSections = JSON.parse(
            JSON.stringify(response.body.sections)
          );

          // Department is not missing
          this.departmentExists = true;
        },
        response => {
          // Department is missing
          this.departmentExists = false;
          console.log("Woops, this department doesn't exist");
        }
      );
    },
    updateContact: debounce(function() {
      // Called when a contact detail changes
      this.replaceDetails();
    }, 100),
    changeSections: debounce(function() {
      // Called when any option is toggled active or changes order
      const parsedSections = this.parsedSections;
      var sorted = [];

      parsedSections.forEach(function(section, i) {
        section.options.forEach(function(option, j) {
          if (option.active) {
            sorted.push({ i: i, j: j, order: option.order });
          } else {
            option.order = 999; // Something high to push to end of list
          }
        });
      });

      this.sorted = sorted.sort(this.sortOrder);
    }, 100),
    replaceDetails: function() {
      // Loop through all fields and replace the %variables% with contact details.
      // TODO: make this loop more efficient
      var sections = this.sections,
        parsedSections = this.parsedSections,
        contacts = this.contacts;

      // Loop each section
      sections.forEach(function(section, i) {
        // Loop each option
        section.options.forEach(function(option, j) {
          // Loop each contact detail
          var newContent = option.content;
          contacts.forEach(function(contact) {
            newContent = newContent.replace(
              "%" + contact.name + "%",
              contact.value
            );
          });
          parsedSections[i].options[j].content = newContent;
        });
      });

      this.loading = false;
    },
    changeRadio: function(section, target) {
      // Loop through radio group and disable all options except target
      this.$nextTick(function() {
        target.active = true;
        target.order = 0; // Hack so it stays at the top of the list
        //this.changeSections()
        section.options.forEach(function(option, i) {
          if (option != target) option.active = false;
        });
      });
      return;
    },
    copyEmail: function(e) {
      // Copy the contents of the email
      var output =
        '<div style="font-family:sans-serif;font-size:13px">' +
        this.constructOutput() +
        "</div>";
      this.copyToClipboard(output);

      console.log("Copied!");

      // Show toast for a second
      var copied = this.copied;
      this.copied = "copied";
      setTimeout(() => (this.copied = ""), 1200);
    },
    constructOutput: function() {
      // Loop through this.sorted and serialize content
      const parsedSections = this.parsedSections;
      var output = "",
        sorted = this.sorted;

      sorted.forEach(function(ref, i) {
        output += parsedSections[ref.i].options[ref.j].content;
      });

      return output;
    },
    copyToClipboard: function(html) {
      // Function from: https://stackoverflow.com/questions/34191780/javascript-copy-string-to-clipboard-as-text-html
      var container = document.createElement("div");
      container.innerHTML = html;
      container.style.position = "fixed";
      container.style.pointerEvents = "none";
      container.style.opacity = 0;

      var activeSheets = Array.prototype.slice
        .call(document.styleSheets)
        .filter(function(sheet) {
          return !sheet.disabled;
        });

      document.body.appendChild(container);
      window.getSelection().removeAllRanges();

      var range = document.createRange();
      range.selectNode(container);
      window.getSelection().addRange(range);

      document.execCommand("copy");

      for (var i = 0; i < activeSheets.length; i++)
        activeSheets[i].disabled = true;

      document.execCommand("copy");

      for (var i = 0; i < activeSheets.length; i++)
        activeSheets[i].disabled = false;

      document.body.removeChild(container);
    },
    onCopyError: function(e) {
      alert("Oops, the text failed to copy");
    },
    changeRoute(route) {
      this.$router.push({ path: route });
    },
    dropped: function(args) {
      // When a section is dragged then dropped, change its order value
      console.log("Dropped");
      const parsedSections = this.parsedSections;
      // Update order
      Array.from(args.el.parentElement.children).forEach(function(item, i) {
        var elem =
          parsedSections[item.dataset.section].options[item.dataset.option];
        elem.order = i;
      });
    },
    sortOrder: function(a, b) {
      // Sort cards by their order property (ascending)
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    }
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString().replace("-", " ");
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/_variables.scss";

.department {
  height: inherit;

  > div {
    height: inherit;
  }
}

h1 {
  background-color: $color-dark;
  color: #fff;
  padding: $base-padding * 2 $base-padding;
  padding-top: $base-padding * 3;
  margin: 0;
  text-transform: uppercase;
  font-size: $font-size-large;
  font-weight: bold;
  text-align: center;
  line-height: 1;

  select {
    background-color: transparent;
    border: none;
    display: block;
    padding: $base-padding/2;
    font-size: $font-size-base;
    font-weight: bold;
    text-align: center;
    color: $color-yellow;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    text-align-last: center;

    &:hover,
    &:focus {
      background-color: lighten($color-dark, 10%);
    }

    option:checked,
    option:selected {
      color: $color-yellow;
      text-transform: uppercase;
    }

    option:disabled {
      text-transform: none;
      color: $color-light-text;
      color: green;
    }
  }

  strong {
    display: block;
  }

  button,
  a {
    text-transform: none;
    font-size: $font-size-small;
    color: #fff;
    display: inline-block;
    font-weight: normal;
    padding-top: $base-padding/2;
    opacity: 0.8;
    text-decoration: underline;

    &:hover,
    &:focus {
      color: #fff;
      opacity: 1;
      outline: none;
    }
  }
}

a {
  color: $color-blue;

  &:hover,
  &:focus {
    color: darken($color-blue, 20%);
  }
}

p {
  line-height: 1.5;
}

table {
  th,
  td {
    padding: $base-padding/2;
  }
}

input {
  width: 100%;
}

button {
  border: none;
  background-color: transparent;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.no-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.hidden-large {
  display: none !important;
}

.svg-icon {
  height: 12px;
  width: 12px;
  margin-bottom: -1px;
  margin-left: 4px;
}

.container {
  display: flex;
  height: inherit;
}

.sidebar,
.content {
  overflow-y: auto;
  position: relative;
  margin: 0;
}

.actions {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1001 !important;

  button {
    border-radius: 5px;
    background-color: $color-green;
    color: #fff;
    padding: $base-padding;
    padding-bottom: 0.7rem;
    margin: $base-padding * 2;
    font-weight: bold;
    text-transform: uppercase;
    position: relative;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);

    &:hover,
    &:focus {
      transform: scale(1.1);
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
    }

    &:active {
      transform: scale(0.9);
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);

      &:before {
        display: none;
      }
    }
  }

  &:before {
    content: attr(data-tooltip);
    display: block;
    position: absolute;
    bottom: 80px;
    left: 10px;
    right: 10px;
    color: #fff;
    text-align: center;
    background: rgba(0, 0, 0, 0.7);
    font-size: $font-size-small;
    text-transform: none;
    padding: $base-padding/2;
    border-radius: 5px;
    opacity: 0;
    transition: all 0.2s 0.2s $transition;
    transform: translate3d(0, 5px, 0);
    z-index: 999;
  }

  &:hover,
  &:focus {
    &:before {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  &:active {
    &:before {
      display: none;
    }
  }
}

.sidebar {
  width: 20%;
  box-shadow: inset 0px -5px 5px 0 rgba(0, 0, 0, 0.2);
  overflow-x: hidden;
  background-color: $color-dark;
  color: #fff;

  h3 {
    font-weight: normal;
    color: #fff;
    font-size: $font-size-small;
    text-transform: uppercase;
    margin: $base-padding;
    margin-top: $base-padding * 2;
    position: relative;
    overflow: hidden;
    opacity: 0.7;
    letter-spacing: 0.03em;

    &:after {
      position: absolute;
      top: 48%;
      overflow: hidden;
      opacity: 0.4;
      width: 100%;
      height: 1px;
      margin-left: 12px;
      content: "\a0";
      background-color: $color-light-grey;
    }
  }

  a,
  button {
    color: #fff;
  }

  label {
    padding-bottom: $base-padding/2;
    display: block;
    font-size: $font-size-small;
    line-height: 1.2;
    cursor: pointer;
  }

  input {
    padding: $base-padding/2;

    &[type="checkbox"],
    &[type="radio"] {
      width: 13px;
      height: 13px;
      padding: 0;
      margin: 0;
      vertical-align: bottom;
      position: relative;
      top: 0;
      *overflow: hidden;
    }

    &[type="radio"] {
      top: -1px;
    }
  }

  .section-padded {
    padding: $base-padding;
    padding-bottom: 0;

    li {
      margin-bottom: $base-padding;
    }
  }

  .section {
    &:last-child {
      padding-bottom: $base-padding * 4;
    }

    label {
      padding: $base-padding/2 $base-padding;
      padding-left: 30px;
      text-indent: -16px;
      border-bottom: 1px solid transparent;
      opacity: 0.8;

      &:hover,
      &:focus {
        opacity: 1;
      }

      &.active {
        font-weight: bold;
        background-color: darken($color-dark, 10%);
        border-color: $color-dark;
        color: #fff;
        opacity: 1;
      }
    }
  }

  footer {
    font-size: $font-size-small;
    margin-top: $base-padding * 2;
    padding: $base-padding;

    span,
    a {
      opacity: 0.4;
    }

    a {
      &:hover,
      &:focus {
        opacity: 1;
      }
    }
  }
}

.updates {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1002;
  color: #fff;
  background-color: rgba(48, 57, 67, 0.9);
  padding: $base-padding * 2 $base-padding;
  line-height: 1.5;

  h3 {
    margin-top: 0;
  }

  ul > li > ul {
    list-style: disc;
    margin-top: $base-padding;
    padding-bottom: $base-padding * 2;
    padding-left: $base-padding * 2;
  }

  li {
    max-width: 650px;
    margin-bottom: $base-padding/2;
  }

  button {
    color: #fff;
    opacity: 0.8;
    font-size: $font-size-small;
    text-decoration: underline;
    padding: $base-padding;
    margin: -$base-padding;

    &:hover,
    &:focus {
      opacity: 1;
    }
  }
}

.content-inputs {
  display: flex;
  align-items: stretch;
  width: 100%;
  position: -webkit-sticky;
  position: sticky;
  top: -1px;
  background: rgba(255, 255, 255, 0.8);
  margin-bottom: $base-padding;
  z-index: 98;

  li {
    padding-top: $base-padding;
    flex: 1;

    label {
      font-size: $font-size-small;
      color: $color-light-text;
    }

    input {
      padding: $base-padding;
      border: 1px solid $color-light-grey;
      border-right: none;
      margin-top: $base-padding/4;
      background: #fff;
      z-index: 2;
      position: relative;
    }

    &:first-child {
      input {
        border-radius: 5px 0 0 5px;
      }
    }

    &:last-child {
      input {
        border-radius: 0 5px 5px 0;
        border-right: 1px solid $color-light-grey;
      }
    }

    &:hover {
      input {
        border-bottom: 1px solid $color-mid-grey;
      }
      label {
        color: $color-dark;
      }
    }
  }
}

.content {
  width: 80%;
  height: 100%;
  padding: 0 $base-padding;

  > div::last-child:not(.loading) {
    padding-bottom: $base-padding * 4;
  }
}

.item,
.gu-mirror {
  display: flex;
  height: inherit;
  list-style: none;
  transition: all 0.15s $transition;

  div {
    width: 98%;
  }
  span {
    padding: 0 $base-padding/2;
    display: block;
    width: 100%;
  }

  textarea {
    border: none;
    padding: $base-padding $base-padding/2;
    margin-left: -$base-padding/2;
    margin-right: -$base-padding/2;
    resize: none;
    width: 100%;
    min-height: 4rem;
    background: transparent;
  }

  ul {
    list-style: disc;
  }

  li {
    margin-bottom: $base-padding/2;
  }

  p {
    &:first-child {
      margin-top: $base-padding/2;
    }
    &:last-child {
      margin-bottom: $base-padding/2;
    }
  }

  img {
    max-width: 700px;
  }
}

.item {
  margin: 0;
  position: relative;
  z-index: 10;
  border-bottom: 3px solid transparent;
  border-top: 3px solid transparent;

  &:hover,
  &:focus {
    cursor: move;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);

    .button-close {
      visibility: visible;
    }
  }

  &.gu-transit {
    outline: 2px dashed $color-mid-grey;
    padding-bottom: 2px;
    margin-bottom: -2px;
    background: #eee;
    filter: grayscale(100%);

    a,
    p,
    small,
    table,
    ul {
      color: $color-light-grey;
    }
    img {
      opacity: 0.1;
      max-height: 250px; // Make images smaller
    }
  }
}

/* Drag and drop */
.gu-mirror {
  position: fixed !important;
  margin: 0 !important;
  z-index: 999 !important;
  opacity: 1;
  padding: 0;
  background: #fff;
  outline: none;
  transform: rotate(3deg);
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
  list-style: none !important;

  .button-close {
    display: none;
  }

  img {
    max-height: 250px;
  }
}

.gu-hide {
  display: none !important;
}
.gu-unselectable {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}

.gu-unselectable {
  .item:not(.gu-transit) {
    border-radius: 0;
    border-bottom: 3px solid #ddd;

    &.gu-mirror {
      border: none;
    }
  }

  .button-close {
    visibility: hidden;
  }
}

.item-type,
.button-close {
  position: absolute;
  line-height: 1;
}

.item-type {
  bottom: $base-padding;
  right: $base-padding;
  text-transform: uppercase;
  color: $color-light-text;
  opacity: 0.5;
  font-size: 12px;
  z-index: 98;
}

.button-close {
  top: $base-padding/2;
  right: $base-padding/2;
  border-radius: 50%;
  color: $color-mid-grey;
  border: 1px solid $color-mid-grey;
  font-weight: bold;
  font-size: $font-size-medium;
  height: 28px;
  width: 28px;
  padding: 0;
  text-align: center;
  font-weight: bold;
  background-color: #fff;
  visibility: hidden;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  transition: all 0.15s ease-out;
  z-index: 100;

  &:hover,
  &:focus {
    background-color: red;
    border-color: red;
    color: #fff;
  }
}

// Show helper text when no sections selected
.helper {
  line-height: 1.2;
  position: absolute;
  bottom: 60px;
  display: flex;

  img {
    max-height: 50px;
    display: inline-block;
    margin-right: $base-padding;
    float: left;
  }

  div {
    font-size: $font-size-medium;
    color: $color-dark;
    font-weight: bold;
    margin-top: -12px;
    transform: rotate(-3deg);
    overflow: hidden;
  }

  ol {
    margin: 0;
    padding: 0 0 0 24px;
  }
}

// Show confirmation at top of screen when copied
.toast {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  font-weight: bold;
  text-align: center;
  z-index: 99;
  background-color: $color-green;
  color: #fff;
  padding: $base-padding;
  transition: transform 0.15s $transition;
  transform: translate3d(0, -50px, 0);
  transform-origin: top center;

  &.copied {
    transform: translate3d(0, 0, 0);
  }
}

.missing {
  text-align: center;
  position: absolute;
  height: auto !important;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  background: #eee;
  padding: 12px 24px;
  border-radius: 6px;
}

// Mobile
@media only screen and (max-width: 600px) {
  h1 {
    font-size: $font-size-base;
    padding: $base-padding;
    padding-top: $base-padding * 2;
  }

  .hidden-small {
    display: none !important;
  }
  .hidden-large {
    display: block !important;
  }

  .actions {
    button {
      margin: $base-padding;
    }

    &:before {
      display: none;
    }
  }

  .sidebar {
    width: 45%;

    h3 {
      &:after {
        display: none;
      }
    }
  }

  .content {
    width: 55%;
    padding-top: $base-padding;
  }

  .item,
  .gu-mirror {
    div {
      width: 98%;
    }
  }

  .helper {
    margin-top: $base-padding * 6;

    img {
      max-height: 30px;
    }
    div {
      font-size: $font-size-base;
    }
  }
}

// Tablet
@media only screen and (min-width: 601px) and (max-width: 769px) {
  .sidebar {
    width: 30%;
  }
  .content {
    width: 70%;
  }
}

// Large desktop
@media only screen and (min-width: 1441px) {
  h1 {
    strong {
      font-size: $font-size-large * 1.2;
    }
  }

  // Make button bigger
  .actions {
    button {
      padding: $base-padding $base-padding * 1.5;
      font-size: $font-size-large;
    }
  }

  .sidebar {
    label {
      font-size: $font-size-base;
    }

    input[type="checkbox"],
    input[type="radio"] {
      margin-right: $base-padding/4;
    }
    input[type="checkbox"] {
      top: -3px;
    }
    input[type="radio"] {
      top: -4px;
    }

    .section {
      label {
        padding-top: 0.45rem;
      }
    }
  }
}

// Webkit browsers only
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .sidebar,
  .content {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
