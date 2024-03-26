const pullData = async (route) =>{
  const response = await fetch(route, {
    method: 'POST',
  })
  //parses the json
  const jsonData = await response.json();

  //prints the json to the console
  return jsonData
}
module.exports = pullData;