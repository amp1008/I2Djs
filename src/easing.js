(function easing (root, factory) {
  const g2d = root
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./geometry.js'))
  } else if (typeof define === 'function' && define.amd) {
    define('easing', ['./geometry.js'], geometry => factory(geometry))
  } else {
    g2d.easing = factory(geometry)
  }
}(this, (geometry) => {
  const t2DGeometry = geometry('2D')

  function linear (starttime, duration) {
    return (starttime / duration)
  }
  function elastic (starttime, duration) {
    const decay = 8
    const force = 2 / 1000
    const t = starttime / duration

    return (1 - (1 - t) * Math.sin(t * duration * force * Math.PI * 2 + (Math.PI / 2)) /
     Math.exp(t * decay))
  }
  function bounce (starttime, duration) {
    const decay = 10
    const t = starttime / duration
    const force = t / 100

    return (1 - (1 - t) * Math.abs(Math.sin(t * duration * force * Math.PI * 2 + (Math.PI / 2))) /
     Math.exp(t * decay))
  }
  function easeInQuad (starttime, duration) {
    const t = starttime / duration
    return t * t
  }
  function easeOutQuad (starttime, duration) {
    const t = starttime / duration
    return t * (2 - t)
  }
  function easeInOutQuad (starttime, duration) {
    const t = starttime / duration
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }
  function easeInCubic (starttime, duration) {
    const t = starttime / duration
    return t2DGeometry.pow(t, 3)
  }
  function easeOutCubic (starttime, duration) {
    let t = starttime / duration
    t -= 1
    return t * t * t + 1
  }
  function easeInOutCubic (starttime, duration) {
    const t = starttime / duration
    return t < 0.5 ? 4 * t2DGeometry.pow(t, 3) : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }
  function sinIn (starttime, duration) {
    const t = starttime / duration
    return 1 - Math.cos(t * Math.PI / 2)
  }
  function easeOutSin (starttime, duration) {
    const t = starttime / duration
    return Math.cos(t * Math.PI / 2)
  }
  function easeInOutSin (starttime, duration) {
    const t = starttime / duration
    return (1 - Math.cos(Math.PI * t)) / 2
  }
  // function easeInQuart (starttime, duration) {
  //   const t = starttime / duration
  //   return t2DGeometry.pow(t, 4)
  // }
  // function easeOutQuart (starttime, duration) {
  //   let t = starttime / duration
  //   t -= 1
  //   return 1 - t * t2DGeometry.pow(t, 3)
  // }
  // function easeInOutQuart (starttime, duration) {
  //   let t = starttime / duration
  //   t -= 1
  //   return t < 0.5 ? 8 * t2DGeometry.pow(t, 4) : 1 - 8 * t * t2DGeometry.pow(t, 3)
  // }
  function cust (custEase) {
    return function custExe (starttime, duration) {
      return custEase(starttime / duration)
    }
  }

  function easing () {
    function fetchTransitionType (_) {
      let res
      switch (_) {
        case 'easeOutQuad':
          res = easeOutQuad
          break
        case 'easeInQuad':
          res = easeInQuad
          break
        case 'easeInOutQuad':
          res = easeInOutQuad
          break
        case 'easeInCubic':
          res = easeInCubic
          break
        case 'easeOutCubic':
          res = easeOutCubic
          break
        case 'easeInOutCubic':
          res = easeInOutCubic
          break
        case 'easeInSin':
          res = sinIn
          break
        case 'easeOutSin':
          res = easeOutSin
          break
        case 'easeInOutSin':
          res = easeInOutSin
          break
        case 'bounce':
          res = bounce
          break
        case 'linear':
          res = linear
          break
        case 'elastic':
          res = elastic
          break
        default:
          res = linear
      }
      if (typeof _ === 'function') { return cust(_) }
      return res
    }

    return fetchTransitionType
  }

  return easing
}))
