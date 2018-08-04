const d3 = require('d3');

const { perHour } = require('./index');

describe('#perHour', () => {
  let result;
  let date;
  let hourDate;
  beforeEach(() => {
    date = new Date(2016,0,1,0);
    hourDate = d3.timeHour.offset(date, '1');
    const data = [{hour: '1', key: 1}];
    result = perHour(data, date, 'key', 'value')
  });
  it('key is the date', () => {
    expect(result.key).toEqual(date);
  });
  it('name is the passed name', () => {
    expect(result.name).toEqual('value');
  });
  it('values are 24 hours', () => {
    expect(result.values.length).toEqual(24);
  });
  describe('values', () => {
    it('key is the date by hour', () => {
      expect(result.values.length).toEqual(24);
    });
    it('name passed value key', () => {
      expect(result.values[0].name).toEqual('key');
    });
    describe('entry matches', () => {
      it('value is key value from origin data', () => {
        expect(result.values[1].value).toEqual(1);
      });
      it('key is the date with new hour', () => {
        expect(result.values[1].key).toEqual(hourDate);
      });
    });
    describe('if no entry matches', () => {
      it('value is 0', () => {
        expect(result.values[0].value).toEqual(0);
      });
    });
  });
  describe('accessFunction', () => {
    beforeEach(() => {
      accessFunction = function(d) {
        return d.a + d.b;
      }
      const data = [{hour: '1', a: 1, b: 2}];
      result = perHour(data, date, 'key', 'value', accessFunction)
    });
    it('second value is the accessFunction result', () => {
      expect(result.values[1].value).toEqual(3);
    });
  });
});
