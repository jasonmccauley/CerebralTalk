const pullData = require('./pullData');

//test dictionary retrieval 
const expectedMessage = { 'message': 'Hello from Flask!' };
test('Data from flask should be: ' + expectedMessage, async () => {
  const data = await pullData('/send_string')
  //console.log(data)
  //console.log(expectedMessage)
  expect(data).toEqual(expectedMessage);
});

//check that the correct key was preserved
test('The key should be ' + Object.keys(expectedMessage)[0], async () => {
  const data = await pullData('/send_string')
  //console.log(Object.keys(expectedMessage)[0])
  expect(Object.keys(data)[0]).toBe(Object.keys(expectedMessage)[0]);
});

//check that the value was preserved
test('The value should be ' + expectedMessage[Object.keys(expectedMessage)[0]], async () => {
  const data = await pullData('/send_string')
  expect(data[Object.keys(expectedMessage)[0]]).toBe(expectedMessage[Object.keys(expectedMessage)[0]]);
});