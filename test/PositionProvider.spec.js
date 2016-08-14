/* eslint-disable */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import PositionProvider from '../src/components/PositionProvider';


describe('PositionProvider', () => {
  it('Should exist', () => {
    expect(PositionProvider).to.exist;
  });

  it('Should render a div', () => {
    expect(shallow(<PositionProvider />).type()).to.equal('div');
  });

  it('Should set aria-describedby and aria-label', () => {
    expect(shallow(<PositionProvider />).prop('aria-describedby')).to.equal('');
    expect(shallow(<PositionProvider />).prop('aria-label')).to.equal('');
  });

  it('Should set position absolute', () => {
    expect(shallow(<PositionProvider />).prop('style')).to.deep.equal({ position: 'absolute' });
  });

  it('Should set onClick function', () => {
    expect(shallow(<PositionProvider />).prop('onClick')).to.be.a('function');
  });

  describe('@getOffset', () => {
    it('Should return the rect of the trigger node and scrollpos of the document', () => {
      const trigger = document.createElement('div');
      document.body.appendChild(trigger);
      const wrapper = shallow(<PositionProvider target={trigger} />);
      const inst = wrapper.instance();
      const offset = inst.getOffset(trigger);
      const rectstub = { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 };
      expect(offset.rect).to.deep.equal(rectstub);
      expect(offset.scrollTop).to.equal(0);
      expect(offset.scrollLeft).to.equal(0);
    });
  });

  describe('@getStyle', () => {
    it('Should call the getBottom method when position == bottom', () => {
      const trigger = document.createElement('div');
      const el = document.createElement('div');
      const wrapper = shallow(<PositionProvider position={'bottom'} target={trigger} />);
      const inst = wrapper.instance();
      inst.el = el;
      sinon.spy(inst, 'getBottom');
      inst.getStyle();
      expect(inst.getBottom.called).to.equal(true);
      inst.getBottom.restore();
    });

    it('Should return a coordinate object that is offset by default SIZE and DEFAULT_ARROW_MARGIN', () => {
      const trigger = document.createElement('div');
      const el = document.createElement('div');
      const wrapper = shallow(<PositionProvider position={'bottom'} target={trigger} />);
      const inst = wrapper.instance();
      inst.el = el;
      expect(inst.getStyle()).to.deep.equal({ left: '0px', top: '9px' });
    });

    it('Should respect custom arrowSize + arrowMargin', () => {
      const trigger = document.createElement('div');
      const el = document.createElement('div');
      const wrapper = shallow(<PositionProvider arrowSize={12} arrowMargin={24} position={'bottom'} target={trigger} />);
      const inst = wrapper.instance();
      inst.el = el;
      expect(inst.getStyle()).to.deep.equal({ left: '0px', top: '36px' });
    });

    it('Should work with horizontal/negative offsets', () => {
      const trigger = document.createElement('div');
      const el = document.createElement('div');
      const wrapper = shallow(<PositionProvider arrowSize={12} arrowMargin={24} position={'left'} target={trigger} />);
      const inst = wrapper.instance();
      inst.el = el;
      expect(inst.getStyle()).to.deep.equal({ top: '0px', left: '-36px' });
    });
  });

  it('should prevent event propagation when clicked', () => {
    const trigger = document.createElement('div');
    const el = document.createElement('div');
    const wrapper = shallow(<PositionProvider arrowSize={12} arrowMargin={24} position={'left'} target={trigger} />);
    const inst = wrapper.instance();
    inst.el = el;

    const mockEvent = {
      stopPropagation: sinon.spy(),
      nativeEvent: {
        stopImmediatePropagation: sinon.spy(),
      },
    };

    wrapper.props().onClick(mockEvent);
    expect(mockEvent.stopPropagation.called).to.equal(true);
    expect(mockEvent.nativeEvent.stopImmediatePropagation.called).to.equal(true);
  });



  describe('@positionElement', () => {
    it('should be called on componentDidUpdate and componentDidMount', () => {
      const trigger = document.createElement('div');
      const el = document.createElement('div');
      const wrapper = shallow(<PositionProvider arrowSize={12} arrowMargin={24} position={'left'} target={trigger} />);
      const inst = wrapper.instance();
      inst.el = el;

      sinon.spy(inst, 'positionElement');
      inst.componentDidUpdate();
      inst.componentDidMount();
      expect(inst.positionElement.called).to.equal(true);
    });
    it('Should set the style of the referenced element', () => {
      const trigger = document.createElement('div');
      const el = document.createElement('div');
      const wrapper = shallow(<PositionProvider arrowSize={12} arrowMargin={24} position={'left'} target={trigger} />);
      const inst = wrapper.instance();
      inst.el = el;
      inst.positionElement({ left: 0, top: 0 });
      expect(inst.el.style.left).to.equal('0px');
      expect(inst.el.style.top).to.equal('0px');
    });
  });

});
