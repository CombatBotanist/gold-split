document.querySelectorAll('.selectable').forEach(element => {
  element.addEventListener('focus', function() {
    this.select();
  });
  element.addEventListener('click', function() {
    this.select();
  });

  element.addEventListener('input', function() {
    if (this.value === '') {
      this.value = this.min;
    }
    let val = parseInt(this.value);
    if (val < this.min) {
      this.value = this.min;
    }
    let values = getValues();
    let total = values.platinum + values.gold + values.silver + values.copper;
    if (total > 0) {
      updateResults(calculate(values));
    }
  });
});

document.querySelectorAll('.toggle-checkbox').forEach(element => {
  element.addEventListener('change', function() {
    let values = getValues();
    let total = values.platinum + values.gold + values.silver + values.copper;
      if (total > 0) {
        updateResults(calculate(values));
      }
  });
});

function getValues() {
  let platinum = parseInt(document.querySelector('#platinum').value || 0);
  let gold = parseInt(document.querySelector('#gold').value || 0);
  let silver = parseInt(document.querySelector('#silver').value || 0);
  let copper = parseInt(document.querySelector('#copper').value || 0);
  let party = parseInt(document.querySelector('#party-size').value || 1);
  return {
    platinum: platinum,
    gold: gold,
    silver: silver,
    copper: copper,
    party: party,
    splitRemainder: document.querySelector('#split-remainder').checked,
    // combine: document.querySelector('#combine').checked,
  }
}

function updateResults(data) {
  let platinum = data.platinum;
  if (data.remainder.platinum > 0) {
    platinum += ` + ${data.remainder.platinum} remaining`;
  }
  document.querySelector('#result-platinum').innerHTML = platinum;

  let gold = data.gold;
  if (data.remainder.gold > 0) {
    gold += ` + ${data.remainder.gold} remaining`;
  }
  document.querySelector('#result-gold').innerHTML = gold;

  let silver = data.silver;
  if (data.remainder.silver > 0) {
    silver += ` + ${data.remainder.silver} remaining`;
  }
  document.querySelector('#result-silver').innerHTML = silver;

  let copper = data.copper;
  if (data.remainder.copper > 0) {
    copper += ` + ${data.remainder.copper} remaining`;
  }
  document.querySelector('#result-copper').innerHTML = copper;
}

function calculate(data) {
  if (!data.splitRemainder && !data.combine) {
    return {
      platinum: Math.floor(data.platinum / data.party),
      gold: Math.floor(data.gold / data.party),
      silver: Math.floor(data.silver / data.party),
      copper: Math.floor(data.copper / data.party),
      remainder: {
        platinum: data.platinum % data.party,
        gold: data.gold % data.party,
        silver: data.silver % data.party,
        copper: data.copper % data.party
      }
    };
  } else if (data.splitRemainder && !data.combine) {
    let platinum = Math.floor(data.platinum / data.party);
    data.gold += data.platinum % data.party * 10;
    let gold = Math.floor(data.gold / data.party);
    data.silver += data.gold % data.party * 10;
    let silver = Math.floor(data.silver / data.party);
    data.copper += data.silver % data.party * 10;
    let copper = Math.floor(data.copper / data.party);
    return {
      platinum: platinum,
      gold: gold,
      silver: silver,
      copper: copper,
      remainder: {
        platinum: 0,
        gold: 0,
        silver: 0,
        copper: data.copper % data.party
      }
    };
  }
}

// with <span id="result-platinum-remainder" class="result-value">0</span> remaining
updateResults(calculate(getValues()));
