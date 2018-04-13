/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import { createFakeEvent } from "tests/helpers";
import { CreateAssistantBase } from "shared/containers/createAssistant";

describe("containers/CreateAssistant", () => {
  it("renders correctly", () => {
    const appSetTitleSpy = jest.fn();
    const setMessage = jest.fn();
    const createBotSpy = jest.fn();
    const historySpy = { length: 0, push: jest.fn() };

    const component = renderer.create(
      <CreateAssistantBase
        isLoading={false}
        createBot={createBotSpy}
        appSetTitle={appSetTitleSpy}
        history={historySpy}
        setMessage={setMessage}
      />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(appSetTitleSpy).toHaveBeenCalled();
    expect(createBotSpy).not.toHaveBeenCalled();
    expect(historySpy.push).not.toHaveBeenCalled();
    expect(setMessage).not.toHaveBeenCalled();
  });

  it("sets a message if uploaded template is not a valid json", () => {
    const setMessage = jest.fn();

    const wrapper = shallow(
      <CreateAssistantBase
        isLoading={false}
        createBot={jest.fn}
        appSetTitle={jest.fn()}
        setMessage={setMessage}
        history={{ length: 0, push: jest.fn() }}
      />,
    );

    wrapper.instance().onImportTemplate("this is not a json obviously");

    expect(setMessage).toHaveBeenCalledWith(
      "imported template is not a valid JSON document",
    );
  });

  it("creates a bot with fullfilled form", () => {
    const createBotSpy = jest.fn();

    const wrapper = shallow(
      <CreateAssistantBase
        isLoading={false}
        createBot={createBotSpy}
        appSetTitle={jest.fn()}
        setMessage={jest.fn()}
        history={{ length: 0, push: jest.fn() }}
      />,
    );

    wrapper
      .find("#create-assistant-name")
      .simulate("change", { target: { value: "assistant-name" } });
    expect(wrapper.state("name")).toEqual("assistant-name");

    wrapper
      .find("#create-assistant-username")
      .simulate("change", { target: { value: "assistant-username" } });
    expect(wrapper.state("username")).toEqual("assistant-username");

    wrapper
      .find("#create-assistant-password")
      .simulate("change", { target: { value: "assistant-password" } });
    expect(wrapper.state("password")).toEqual("assistant-password");

    wrapper
      .find("#create-assistant-email")
      .simulate("change", { target: { value: "fake-email@opla.ai" } });
    expect(wrapper.state("email")).toEqual("fake-email@opla.ai");

    wrapper.find("#create-assistant-language").simulate("selected", "fr");
    expect(wrapper.state("language")).toEqual("fr");

    wrapper
      .find("#create-assistant-form")
      .simulate("submit", createFakeEvent());

    expect(wrapper.state("loading")).toEqual(true);
    expect(createBotSpy).toHaveBeenCalled();
  });
});