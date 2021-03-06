/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import createReducer from "zoapp-front/reducers/createReducer";

import {
  initialState as zoappInitialState,
  handlers as zoappHandlers,
} from "zoapp-front/reducers/app";

import {
  API_ADMIN,
  AUTH_SIGNOUT,
  FETCH_FAILURE,
  FETCH_REQUEST,
  FETCH_SUCCESS,
} from "zoapp-front/actions/constants";

import {
  API_CREATEBOT,
  API_DELETEINTENT,
  API_DELETEMIDDLEWARE,
  API_GETINTENTS,
  API_GETMIDDLEWARES,
  API_IMPORT,
  API_MOVEINTENT,
  API_PUBLISH,
  API_SAVEBOT,
  API_SB_GETCONTEXT,
  API_SB_GETMESSAGES,
  API_SB_RESET,
  API_SB_SENDMESSAGE,
  API_SENDINTENT,
  API_SETMIDDLEWARE,
  APP_DELETEINTENTACTION,
  APP_SELECTINTENT,
  APP_SETINTENTACTION,
  APP_UPDATEINTENT,
  APP_UPDATEPUBLISHER,
  API_GETTEMPLATES,
  API_GETLANGUAGES,
} from "../actions/constants";

export const defaultTemplates = [
  { id: "eb05e2a4-251a-4e11-a907-b1f3bcc20283", name: "Empty" },
  { id: "571a2354-ec80-4423-8edb-94d0a934fbb6", name: "Import" },
];
export const defaultLanguages = [{ id: "en", name: "English", default: true }];

export const initialState = {
  ...zoappInitialState,
  intents: null,
  selectedBotId: null,
  selectedIntentIndex: 0,
  sandbox: null,
  loadingMessages: false,
  templates: defaultTemplates,
  languages: defaultLanguages,
};

export default createReducer(initialState, {
  ...zoappHandlers,

  [API_ADMIN + FETCH_SUCCESS]: (state, { admin }) => {
    let { selectedBotId } = state;
    if (selectedBotId == null && admin.bots && admin.bots.length > 0) {
      selectedBotId = admin.bots[0].id;
    }
    return {
      ...state,
      loading: false,
      error: null,
      admin,
      selectedBotId,
    };
  },

  [API_GETMIDDLEWARES + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
    lastMiddleware: null,
  }),
  [API_GETMIDDLEWARES + FETCH_SUCCESS]: (state, { middlewares }) => ({
    ...state,
    loading: false,
    error: null,
    middlewares: [...middlewares],
  }),
  [API_GETMIDDLEWARES + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_SETMIDDLEWARE + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
    lastMiddleware: null,
  }),
  [API_SETMIDDLEWARE + FETCH_SUCCESS]: (state, { middleware }) => {
    const middlewares = [];
    let v = true;
    state.middlewares.forEach((m) => {
      if (m.id === middleware.id) {
        middlewares.push({ ...middleware });
        v = false;
      } else {
        middlewares.push(m);
      }
    });
    if (v) {
      middlewares.push({ ...middleware });
    }
    return {
      ...state,
      loading: false,
      error: null,
      middlewares,
      lastMiddleware: { ...middleware },
    };
  },
  [API_SETMIDDLEWARE + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_DELETEMIDDLEWARE + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
    lastMiddleware: null,
  }),
  [API_DELETEMIDDLEWARE + FETCH_SUCCESS]: (state, { middlewareId }) => {
    const middlewares = [];
    state.middlewares.forEach((m) => {
      if (m.id !== middlewareId) {
        middlewares.push(m);
      }
    });
    return {
      ...state,
      loading: false,
      error: null,
      middlewares,
    };
  },
  [API_DELETEMIDDLEWARE + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),
  [API_CREATEBOT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_CREATEBOT + FETCH_SUCCESS]: (state, { bot }) => {
    const { error } = bot;
    let { selectedBotId } = state;
    let admin = null;
    if (state.admin != null) {
      admin = { ...state.admin };
    }
    if (error) {
      // error = bot.error;
    } else if (admin != null) {
      selectedBotId = bot.id;
      const bots = [];
      if (admin.bots) {
        admin.bots.forEach((b) => {
          if (b.id === selectedBotId) {
            bots.push({ ...bot });
          } else {
            bots.push(b);
          }
        });
      } else {
        bots.push({ ...bot });
      }
      bots.push({ ...bot });
      admin.bots = bots;
    }
    return {
      ...state,
      loading: false,
      error,
      admin,
      selectedBotId,
    };
  },
  [API_CREATEBOT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_SAVEBOT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_SAVEBOT + FETCH_SUCCESS]: (state, { bot }) => {
    const { error } = bot;
    let admin = null;
    if (state.admin != null) {
      admin = { ...state.admin };
    }
    if (error) {
      // error = bot.error;
    } else if (admin != null) {
      const botId = bot.id;
      const bots = [];
      if (admin.bots) {
        admin.bots.forEach((b) => {
          if (b.id === botId) {
            bots.push({ ...bot });
          } else {
            bots.push({ ...b });
          }
        });
      } else {
        bots.push({ ...bot });
      }
      admin.bots = bots;
    }
    return {
      ...state,
      loading: false,
      error,
      admin,
    };
  },
  [API_SAVEBOT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_IMPORT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_IMPORT + FETCH_SUCCESS]: (state, { result }) => {
    let { intents, selectedIntentIndex, selectedIntent } = state;
    if (result.intents) {
      intents = [...result.intents];
      if (selectedIntentIndex >= intents.length) {
        selectedIntentIndex = 0;
      }
      if (intents && (!selectedIntent || !selectedIntent.notSaved)) {
        selectedIntent = { ...intents[selectedIntentIndex] };
      } else if (!selectedIntent && !selectedIntent.notSaved) {
        selectedIntent = null;
      } else {
        // TODO handle conflicts
      }
    }
    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntentIndex,
      selectedIntent,
    };
  },
  [API_IMPORT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_PUBLISH + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_PUBLISH + FETCH_SUCCESS]: (state, { result }) => {
    let { intents, selectedIntentIndex, selectedIntent } = state;
    if (result.intents) {
      intents = [...result.intents];
      if (selectedIntentIndex >= intents.length) {
        selectedIntentIndex = 0;
      }
      if (intents && (!selectedIntent || !selectedIntent.notSaved)) {
        selectedIntent = { ...intents[selectedIntentIndex] };
      } else if (!selectedIntent && !selectedIntent.notSaved) {
        selectedIntent = null;
      } else {
        // TODO handle conflicts
      }
    }
    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntentIndex,
      selectedIntent,
    };
  },
  [API_PUBLISH + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_GETINTENTS + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_GETINTENTS + FETCH_SUCCESS]: (state, { intents }) => {
    let { selectedIntent, selectedIntentIndex } = state;
    if (!selectedIntentIndex || selectedIntentIndex >= intents.length) {
      selectedIntentIndex = 0;
    }
    if (intents && (!selectedIntent || !selectedIntent.notSaved)) {
      selectedIntent = { ...intents[selectedIntentIndex] };
    } else if (!selectedIntent && !selectedIntent.notSaved) {
      selectedIntent = null;
    } else {
      // TODO handle conflicts
    }
    return {
      ...state,
      loading: false,
      error: null,
      intents: [...intents],
      selectedIntentIndex,
      selectedIntent,
    };
  },
  [API_GETINTENTS + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_SENDINTENT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_SENDINTENT + FETCH_SUCCESS]: (state, { data }) => {
    // WIP search for intent in intents and add replace it
    let { intents, selectedIntent, selectedIntentIndex } = state;
    let remoteIntents = null;
    if (data.intents) {
      if (Array.isArray(data.intents)) {
        remoteIntents = data.intents;
      }
    } else {
      remoteIntents = [];
      remoteIntents.push(data);
    }
    if (remoteIntents) {
      remoteIntents.forEach((intent) => {
        let previousIntent = null;
        let previousIntentIndex = -1;
        for (let i = 0; i < intents.length; i += 1) {
          const int = intents[i];
          if (!int.id) {
            if (int.name === intent.name) {
              int.id = intent.id;
              previousIntent = { ...int };
              previousIntentIndex = i;
              break;
            }
          } else if (int.id === intent.id) {
            int.name = intent.name;
            if (intent.input) {
              int.input = [...intent.input];
            } else {
              int.input = null;
            }
            if (intent.output) {
              int.output = [...intent.output];
            } else {
              int.output = null;
            }
            previousIntent = { ...int };
            previousIntentIndex = i;
            break;
          }
        }

        if (previousIntent) {
          intents = [...state.intents];
          if (previousIntent.notSaved) {
            delete previousIntent.notSaved;
          }
          intents[previousIntentIndex] = previousIntent;

          if (selectedIntent && selectedIntent.id === intent.id) {
            // WIP Compare input & output arrays
            selectedIntent = { ...intent };
          }
        } else {
          intents.push({ ...intent });
          selectedIntentIndex = intents.length - 1;
          selectedIntent = { ...intent };
        }
      });
    }
    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntentIndex,
      selectedIntent,
    };
  },
  [API_SENDINTENT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_DELETEINTENT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_DELETEINTENT + FETCH_SUCCESS]: (state, { intent }) => {
    // WIP search for intentId in intents and remove it
    const intents = [...state.intents];
    let { selectedIntent, selectedIntentIndex } = state;
    for (let i = 0; i < intents.length; i += 1) {
      if (intents[i].id === intent.id) {
        intents.splice(i, 1);
        if (selectedIntentIndex === i) {
          selectedIntentIndex = i - 1;
          if (selectedIntentIndex < 0) {
            selectedIntentIndex = 0;
          }
          if (intents && selectedIntentIndex < intents.length) {
            selectedIntent = { ...intents[selectedIntentIndex] };
          } else {
            selectedIntent = null;
          }
        }
        break;
      }
    }
    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntentIndex,
      selectedIntent,
    };
  },
  [API_DELETEINTENT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_MOVEINTENT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_MOVEINTENT + FETCH_SUCCESS]: (state, { from, to }) => {
    const intents = [...state.intents];
    intents.splice(to, 0, intents.splice(from, 1)[0]);

    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntent: intents[to],
      selectedIntentIndex: to,
    };
  },
  [API_MOVEINTENT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  /* API Sandbox section */
  [API_SB_GETMESSAGES + FETCH_REQUEST]: (state) => ({
    ...state,
    loadingMessages: true,
    error: null,
  }),
  [API_SB_GETMESSAGES + FETCH_SUCCESS]: (state, { conversations }) => {
    // WIP, TODO check if BotId is ok
    let { sandbox } = state;
    if (!sandbox) {
      sandbox = {};
    }
    if (conversations) {
      sandbox.conversations = [...conversations];
    } else {
      sandbox.conversations = [];
    }
    return {
      ...state,
      loadingMessages: false,
      error: null,
      sandbox,
    };
  },
  [API_SB_GETMESSAGES + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loadingMessages: false,
    error,
  }),

  [API_SB_SENDMESSAGE + FETCH_REQUEST]: (state) => ({
    ...state,
    loadingMessages: true,
    error: null,
  }),
  [API_SB_SENDMESSAGE + FETCH_SUCCESS]: (state) => {
    // TODO , { conversationId, message }
    const { sandbox } = state;
    // sandbox.conversations = [...conversations];
    return {
      ...state,
      loadingMessages: false,
      error: null,
      sandbox,
    };
  },
  [API_SB_SENDMESSAGE + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loadingMessages: false,
    error,
  }),

  [API_SB_GETCONTEXT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_SB_GETCONTEXT + FETCH_SUCCESS]: (state, { context }) => {
    // TODO check if BotId is ok
    const { sandbox } = state;
    sandbox.context = [...context];
    return {
      ...state,
      loading: false,
      error: null,
      sandbox,
    };
  },
  [API_SB_GETCONTEXT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_SB_RESET + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_SB_RESET + FETCH_SUCCESS]: (state) => {
    // TODO check if BotId is ok
    const sandbox = { conversations: [] };
    return {
      ...state,
      loading: false,
      error: null,
      sandbox,
    };
  },
  [API_SB_RESET + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  /* APP Section */
  [APP_SELECTINTENT]: (state, { selectedBotId, selectedIntentIndex }) => {
    let selectedIntent = null;
    if (state.intents && selectedIntentIndex < state.intents.length) {
      selectedIntent = { ...state.intents[selectedIntentIndex] };
    }
    return {
      ...state,
      selectedBotId,
      selectedIntentIndex,
      selectedIntent,
    };
  },
  [APP_UPDATEPUBLISHER]: (state, { selectedBotId, publisher }) => {
    const publishers = { ...state.publishers };
    if (state.selectedBotId === selectedBotId) {
      const { name } = publisher;
      publishers[name] = { ...publisher };
    }
    return { ...state, publishers };
  },
  [APP_UPDATEINTENT]: (state, { selectedBotId, intent }) => {
    const selectedIntentIndex =
      state.selectedIntentIndex !== undefined ? state.selectedIntentIndex : 0;
    const intents = [...state.intents];
    let selectedIntent = null;
    if (intents.length > 0 && selectedIntentIndex < intents.length) {
      selectedIntent = { ...intent };
      intents[selectedIntentIndex] = selectedIntent;
      selectedIntent.notSaved = true;
    }
    return {
      ...state,
      selectedBotId,
      intents,
      selectedIntentIndex,
      selectedIntent,
    };
  },
  [APP_SETINTENTACTION]: (
    state,
    { actionContainer, actionType, actionValue, selectedAction },
  ) => {
    const intents = [...state.intents];
    const selectedIntentIndex =
      state.selectedIntentIndex !== undefined ? state.selectedIntentIndex : 0;
    const intent = intents[selectedIntentIndex];
    if (!intent[actionContainer]) {
      intent[actionContainer] = [];
    }
    const actions = intent[actionContainer];

    if (selectedAction === undefined) {
      if (actionType === "condition") {
        // WIP handle Condition type
        let condition;
        if (actions.length === 0) {
          condition = { type: actionType, children: [] };
          actions.push(condition);
        } else {
          [condition] = actions;
        }
        condition.children.push(actionValue);
      } else {
        actions.push(actionValue);
      }
    } else if (actionType === "condition") {
      // WIP handle Condition type
      const condition = actions[0];
      condition.children.splice(selectedAction, 1, actionValue);
    } else {
      actions.splice(selectedAction, 1, actionValue);
    }
    intent.notSaved = true;
    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntentIndex,
      selectedIntent: { ...intent },
    };
  },
  [APP_DELETEINTENTACTION]: (state, { actionContainer, selectedAction }) => {
    const intents = [...state.intents];
    const selectedIntentIndex =
      state.selectedIntentIndex !== undefined ? state.selectedIntentIndex : 0;
    const intent = intents[selectedIntentIndex];
    const actions = intent[actionContainer];
    // WIP handle Condition type
    if (actions && actions.length > 0) {
      if (typeof actions[0] === "string") {
        actions.splice(selectedAction, 1);
      } else if (actions[0].type === "condition") {
        const { children } = actions[0];
        children.splice(selectedAction, 1);
        if (children.length === 0) {
          actions.splice(0, 1);
        }
      }
      intent.notSaved = true;
    }
    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntentIndex,
      selectedIntent: { ...intent },
    };
  },

  /* Auth section */
  [AUTH_SIGNOUT + FETCH_SUCCESS]: (state) => ({
    ...state,
    ...initialState,
  }),

  /* Api admin section */
  [API_GETTEMPLATES + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_GETTEMPLATES + FETCH_SUCCESS]: (state, { templates }) => ({
    ...state,
    loading: false,
    error: null,
    templates: templates.concat(defaultTemplates),
  }),
  [API_GETTEMPLATES + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message,
    templates: defaultTemplates,
  }),

  [API_GETLANGUAGES + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_GETLANGUAGES + FETCH_SUCCESS]: (state, { languages }) => ({
    ...state,
    loading: false,
    error: null,
    languages,
  }),
  [API_GETLANGUAGES + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message,
    languages: defaultLanguages,
  }),
});
