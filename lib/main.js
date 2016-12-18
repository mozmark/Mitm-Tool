/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=8 sts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// perform setup

const tabs = require("sdk/tabs");
const data = require("sdk/self").data;
const buttons = require('sdk/ui/button/action');
const {Utils} = require("./secutils");
Utils.setupPrefs();

var isPrefsPageOpen = false;

var button = buttons.ActionButton({
  id: "pnh-link",
  label: "Plug N Hack",
  icon: {
    "16": "./pnh.png",
    "32": "./pnh.png",
    "48": "./pnh.png",
  },
  onClick: function(state) {
    tabs.on('open', function() {
      isPrefsPageOpen = true;
    });
    tabs.on('close', function() {
      isPrefsPageOpen = false;
    });
    tabs.on('pageshow', function(tab) {
      console.log(tab.url + " is loaded");
      // Initiates the setup
      require("./config").setup();
      const prefs_js_url = data.url('prefs.js');
      tabs.activeTab.attach({
        // Content script attached
        contentScriptFile: prefs_js_url
      });
    });
    const prefs_html_url = data.url("prefs.html");
    !isPrefsPageOpen ? tabs.open(prefs_html_url): (function() {
      for(let tab of tabs) {
        if (tab.url === prefs_html_url) {
          tab.activate();
          break;
        }
      }
    })();
  }
});

/* Temporarily disabled gcli functionality due to non-working state. */
// // install the commands
// const {installCommands} = require("./commands");
// installCommands();
