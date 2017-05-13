import React from 'react';
import { mount } from 'enzyme';
import MultiInput from './MultiInput';

describe('MultiInput', () => {
    it('must render an input for every line', () => {
        const lines = ['foo', 'bar'];
        const wrapper = mount(<MultiInput lines={lines} />);

        expect(wrapper.find('input').length).toBe(lines.length);
    });

    it('must invoke onChangeLine callback when input is changed', () => {
        const lines = ['foo', 'bar'];
        const wrapper = mount(
            <MultiInput
                lines={lines}
                onChangeLine={jest.fn()}
            />
        );
        const changeIndex = 1;
        const inputWrapper = wrapper.find('input').at(changeIndex);

        inputWrapper.simulate('change');

        expect(wrapper.prop('onChangeLine')).toHaveBeenCalledTimes(1);
        expect(wrapper.prop('onChangeLine')).toHaveBeenCalledWith(
            changeIndex,
            inputWrapper.getNode().value,
        );
    });

    it('must invoke onAddLine when tab is pressed in the last row', () => {
        const lines = ['foo', 'bar'];
        const wrapper = mount(
            <MultiInput
                lines={lines}
                onAddLine={jest.fn()}
            />
        );
        const lastIndex = lines.length - 1;
        const inputWrapper = wrapper.find('input').at(lastIndex);

        inputWrapper.simulate('keydown', { key: 'Tab', keyCode: 9, which: 9 });

        expect(wrapper.prop('onAddLine')).toHaveBeenCalledTimes(1);
        // TODO: Does it do anything?
        expect(wrapper.prop('onAddLine')).toHaveBeenCalledWith();
    });

    it('must not invoke onAddLine when tab is pressed on the last row and shift is held', () => {
        const lines = ['foo', 'bar'];
        const wrapper = mount(
            <MultiInput
                lines={lines}
                onAddLine={jest.fn()}
            />
        );
        const lastIndex = lines.length - 1;
        const inputWrapper = wrapper.find('input').at(lastIndex);

        inputWrapper.simulate('keydown', { key: 'Tab', keyCode: 9, which: 9, shiftKey: true });

        expect(wrapper.prop('onAddLine')).not.toHaveBeenCalled();
    });

    it('must not invoke onAddLine line when tab is pressed on the last row and the line is empty', () => {
        const lines = ['foo', ''];
        const wrapper = mount(
            <MultiInput
                lines={lines}
                onAddLine={jest.fn()}
            />
        );
        const emptyIndex = 1;
        const inputWrapper = wrapper.find('input').at(emptyIndex);

        inputWrapper.simulate('keydown', { key: 'Tab', keyCode: 9, which: 9 });

        expect(wrapper.prop('onAddLine')).not.toHaveBeenCalled();
    });

    it('must invoke onRemoveLine when empty line is blurred', () => {
        const lines = ['foo', ''];
        const wrapper = mount(
            <MultiInput
                lines={lines}
                onRemoveLine={jest.fn()}
            />
        );
        const emptyIndex = 1;
        const inputWrapper = wrapper.find('input').at(emptyIndex);

        inputWrapper.simulate('blur');

        expect(wrapper.prop('onRemoveLine')).toHaveBeenCalledTimes(1);
        expect(wrapper.prop('onRemoveLine')).toHaveBeenCalledWith(emptyIndex);
    });

    it('must invoke onRemoveLine when backspace is pressed on empty row', () => {
        const lines = ['foo', '', 'baz'];
        const wrapper = mount(
            <MultiInput
                lines={lines}
                onRemoveLine={jest.fn()}
            />
        );
        const emptyIndex = 1;
        const inputWrapper = wrapper.find('input').at(emptyIndex);

        inputWrapper.simulate('keydown', { key: 'Backspace', keyCode: 8, which: 8 });

        expect(wrapper.prop('onRemoveLine')).toHaveBeenCalledTimes(1);
        expect(wrapper.prop('onRemoveLine')).toHaveBeenCalledWith(emptyIndex);
    });

    it('must focus on the previous line when backspace is pressed on empty row', () => {
        const lines = ['foo', '', 'baz'];
        const wrapper = mount(
            <MultiInput
                lines={lines}
                onRemoveLine={jest.fn()}
            />
        );
        const emptyIndex = 1;
        const inputWrapper = wrapper.find('input').at(emptyIndex);
        const previousInput = wrapper.find('input').at(emptyIndex - 1);

        // TODO: replace with jest.spyOn() after create-react-app updates to jest 19
        previousInput.node.focus = jest.fn();
        inputWrapper.simulate('keydown', { key: 'Backspace', keyCode: 8, which: 8 });

        expect(previousInput.node.focus).toHaveBeenCalledTimes(1);
    });

    it('must invoke onRemoveLine when backspace is pressed on empty row', () => {
        const lines = ['foo', '', 'baz'];
        const wrapper = mount(
            <MultiInput
                lines={lines}
                onRemoveLine={jest.fn()}
            />
        );
        const emptyIndex = 1;
        const inputWrapper = wrapper.find('input').at(emptyIndex);

        inputWrapper.simulate('keydown', { key: 'Delete', keyCode: 46, which: 46 });

        expect(wrapper.prop('onRemoveLine')).toHaveBeenCalledTimes(1);
        expect(wrapper.prop('onRemoveLine')).toHaveBeenCalledWith(emptyIndex);
    });


    // describe('when pressing backspace in an empty row', () => {
    //     const lines = [
    //         'one',
    //         'two',
    //         'three',
    //         'four',
    //     ];
    //     const focusIndex = 2;
    //     let wrapper;
    //
    //     beforeAll(() => {
    //         wrapper = mount(
    //             <MultiInput
    //                 lines={lines}
    //                 onRemoveLine={jest.fn()}
    //             />
    //         );
    //     });
    //
    //     it('must remove the line', () => {
    //         expect(wrapper.props().onRemoveLine).toHaveBeenCalledTimes(1);
    //         expect(wrapper.props().onRemoveLine).toHaveBeenCalledWith(focusIndex);
    //     });
    //
    //     it('must focus on the previous line', () => {
    //         const everyInput = wrapper.find('input');
    //         const previousInput = everyInput.at(focusIndex - 1);
    //
    //         expect(previousInput.is(':focus')).toBe(true);
    //     });
    // });
});
