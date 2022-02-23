module.exports = (rows)=> {
  const parsedRows = rows.map((row)=>{
    const replaced = {}

    for (let key in row){
      const camelCase = key.replace(/([-_][a-z])/gi,($1)=>{
        // console.log($1.toUpperCase().replace('_',''))
        return $1.toUpperCase().replace('_','')
      })
      // console.log(camelCase,key)
      replaced[camelCase] = row[key]
      // console.log(camelCase)
    }
    // console.log(replaced)
    return replaced
  })

  return parsedRows
}