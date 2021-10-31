const ID = "B4C9FE04-6840-4215-A643-37A201055AF8"

/***/

function quantile(arr, q) {
  const sorted = arr.sort((a, b) => a - b)
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base

  if (sorted[base + 1] !== undefined) {
    return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]))
  } else {
    return Math.floor(sorted[base])
  }
}

const table = (data) => {
  let items = {}

  for (let { name, value } of data) {
    if (items[name]) items[name].push(value)
    else items[name] = [value]
  }

  let table = {}

  for (let key in items) {
    table[key] = row(items[key])
  }

  console.table(table)
}

const row = (data) => {
  data.sort((a, b) => a - b)

  return {
    hits: data.length,
    p25: quantile(data, 0.25),
    p50: quantile(data, 0.5),
    p75: quantile(data, 0.75),
    p95: quantile(data, 0.95)
  }
}

const intersect = (data, name, param) => {
  table(
    data
      .filter((item) => item.name === name)
      .map((item) => ({ name: item.additional[param], value: item.value }))
  )
}

const prepareData = (result) => {
  return result.data.map((item) => {
    item.date = item.timestamp.split("T")[0]
    return item
  })
}

/***/

const showMetricsByDate = (data, date) => {
  console.log(`Metrics for ${date}:`)
  table(data.filter((item) => item.date === date))
}

const showMetricsByPeriod = (data, start, end) => {
  console.log(`Metrics from ${start} to ${end}:`)
  table(data.filter((item) => item.date >= start && item.date <= end))
}

const showMetricsByEnvironment = (data, name) => {
  console.log(`Metrics of '${name}' separated by Environment:`)
  intersect(data, name, "env")
}

const showMetricsByBrowser = (data, name) => {
  console.log(`Metrics of '${name}' separated by by Web-Browsers:`)
  intersect(data, name, "browser")
}

const showMetricsByOS = (data, name) => {
  console.log(`Metrics of '${name}' separated by Operating Systems:`)
  intersect(data, name, "os")
}

const showMetricsByPlatform = (data, name) => {
  console.log(`Metrics of '${name}' separated by Platform (Desktop / Mobile):`)
  intersect(data, name, "platform")
}

const showSessionId = (id) => {
  console.log(`Session ID: ${id}`)
}

/***/

fetch(`https://shri.yandex/hw/stat/data?counterId=${ID}`)
  .then((res) => res.json())
  .then((result) => {
    let data = prepareData(result)

    console.log("*** Metrics ***")
    showSessionId(ID)

    showMetricsByDate(data, "2021-10-31")
    showMetricsByPeriod(data, "2021-09-31", "2021-10-31")
    showMetricsByEnvironment(data, "connect")
    showMetricsByPlatform(data, "connect")
    showMetricsByBrowser(data, "connect")
    showMetricsByOS(data, "connect")
  })
