/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import DonutChart from "shared/components/donutChart";
import { shallow, mount } from "enzyme";

describe("components/donutChart", () => {
  it("renders correctly", () => {
    const wrapper = shallow(<DonutChart title="foobar" dataset={0} />);
    expect(wrapper).toHaveLength(1);
  });
  it("renders properties correctly", () => {
    const wrapper = mount(<DonutChart title="foobar" dataset={1} />);
    expect(wrapper.prop("title")).toEqual("foobar");
    expect(wrapper.prop("dataset")).toEqual(1);
  });
});
