/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import Front from "zoapp-front/front";
import Screen from "zoapp-front/containers/screen";
import Home from "OplaContainers/home";
import CreateAssistant from "OplaContainers/createAssistant";
import AdminManager from "OplaContainers/adminManager";
import BotManager from "OplaContainers/botManager";
import configureStore from "OplaLibs/store";
// eslint-disable-next-line import/no-unresolved
import config from "../../config/default.json";

const app = {
  name: "Opla.ai CE",
  version: "0.1.0",
  design: {
    drawer: {
      type: "persistent",
      themeDark: true,
    },
  },
  screens: [
    {
      id: "1",
      isDrawerItem: true,
      icon: "dashboard",
      name: "Dashboard",
      access: "auth",
      path: "/",
      render: props => React.createElement(Home, props),
    },
    {
      id: "2",
      isDrawerItem: true,
      icon: "build",
      name: "Builder",
      path: "/builder",
      access: "auth",
      panels: ["Intents", "Entities", "Flow"],
      toolbox: ["Publish"],
      render: props => React.createElement(BotManager, props),
    },
    {
      id: "3",
      isDrawerItem: true,
      icon: "settings",
      name: "Admin",
      path: "/admin",
      access: "auth",
      panels: ["General", "Extensions", "Users", "Advanced"],
      render: props => React.createElement(AdminManager, props),
    },
    {
      id: "4",
      name: "Create Assistant",
      path: "/create",
      access: "public",
      render: props => React.createElement(CreateAssistant, props),
    },
    {
      id: "5",
      isDrawerItem: true,
      icon: "home",
      name: "Home",
      path: "*",
      access: "public",
      render: props => React.createElement(Home, props),
    },
    {
      id: "6",
      isDrawerItem: true,
      name: "Help",
      icon: "help",
      path: "/help",
      access: "all",
      render: props => React.createElement(Screen, props, "Help"),
    },
  ],
};

const store = configureStore({ app });

const front = new Front("app", app, config, { store });
front.start();
