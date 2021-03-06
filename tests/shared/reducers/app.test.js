/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as actions from "shared/actions/app";
import * as apiActions from "shared/actions/api";
import * as authActions from "zoapp-front/actions/auth";
import reducer, {
  initialState,
  defaultTemplates,
  defaultLanguages,
} from "shared/reducers/app";

describe("reducers/app", () => {
  it("returns the initial state", () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  describe("intents", () => {
    it("enables loading on move intent request", () => {
      const state = reducer(
        undefined,
        apiActions.apiMoveIntentRequest({
          botId: "bot-1",
          intentId: "intent-1",
          from: 0,
          to: 1,
        }),
      );
      expect(state).toEqual({
        ...initialState,
        loading: true,
      });
    });

    it("swaps intents on apiMoveIntentSuccess()", () => {
      const intents = [
        {
          id: "intent-1",
          botId: "bot-123",
          name: "intent 1",
        },
        {
          id: "intent-2",
          botId: "bot-223",
          name: "intent 2",
        },
        {
          id: "intent-3",
          botId: "bot-323",
          name: "intent 3",
        },
      ];

      let state = reducer(undefined, apiActions.apiGetIntentsSuccess(intents));

      let ids = state.intents.map((intent) => intent.id);
      expect(ids).toEqual(["intent-1", "intent-2", "intent-3"]);

      // move the first intent to the second position
      state = reducer(state, apiActions.apiMoveIntentSuccess(0, 1));

      ids = state.intents.map((intent) => intent.id);
      expect(ids).toEqual(["intent-2", "intent-1", "intent-3"]);

      // also check the other state attributes updated
      expect(state.loading).toEqual(false);
      expect(state.error).toEqual(null);
      expect(state.selectedIntent).toEqual(state.intents[1]);
      expect(state.selectedIntentIndex).toEqual(1);

      // move the second intent to the last position
      state = reducer(state, apiActions.apiMoveIntentSuccess(1, 2));

      ids = state.intents.map((intent) => intent.id);
      expect(ids).toEqual(["intent-2", "intent-3", "intent-1"]);

      // move the third intent to the first position
      state = reducer(state, apiActions.apiMoveIntentSuccess(2, 0));

      ids = state.intents.map((intent) => intent.id);
      expect(ids).toEqual(["intent-1", "intent-2", "intent-3"]);
    });

    it("stores the error on move intent failure", () => {
      const e = new Error();

      const state = reducer(undefined, apiActions.apiMoveIntentFailure(e));
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: e,
      });
    });

    it("sets the application title", () => {
      const title = "app title";

      const prevState = reducer(undefined, {});
      expect(prevState).toEqual(initialState);

      const state = reducer(prevState, actions.appSetTitle(title));
      expect(state).toEqual({
        ...prevState,
        titleName: title,
      });
    });

    it("resets the state when user signs out", () => {
      const title = "some title";

      const prevState = reducer(undefined, actions.appSetTitle(title));
      expect(prevState).toEqual({
        ...initialState,
        titleName: title,
      });

      const state = reducer(prevState, authActions.signOutComplete({}));
      expect(state).toEqual(initialState);
    });
  });

  describe("templates", () => {
    it("returns default templates when the request fails", () => {
      const state = reducer(
        initialState,
        apiActions.apiGetTemplatesFailure(Error("it fails")),
      );

      expect(state.templates).toEqual(defaultTemplates);
      expect(state.error).toEqual("it fails");
    });

    it("merges default templates with templates from the API", () => {
      const templates = [{ name: "foo" }, { name: "bar" }];
      const state = reducer(
        initialState,
        apiActions.apiGetTemplatesSuccess(templates),
      );

      expect(state.templates).toEqual(templates.concat(defaultTemplates));
    });
  });

  describe("languages", () => {
    it("returns default languages when the request fails", () => {
      const state = reducer(
        initialState,
        apiActions.apiGetLanguagesFailure(Error("it fails")),
      );

      expect(state.languages).toEqual(defaultLanguages);
      expect(state.error).toEqual("it fails");
    });
  });

  it("returns the languages sent by the api on success", () => {
    const languages = [
      { id: "en", name: "English", default: true },
      { id: "fr", name: "French", default: false },
    ];

    const state = reducer(
      initialState,
      apiActions.apiGetLanguagesSuccess(languages),
    );

    expect(state.languages).toEqual(languages);
  });
});
