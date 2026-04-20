const addDebugOverlay = (lines) => {
  const id = 'xr-debug-overlay'
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('pre')
    el.id = id
    el.style.position = 'fixed'
    el.style.top = '8px'
    el.style.right = '8px'
    el.style.zIndex = '99999'
    el.style.maxWidth = '42vw'
    el.style.padding = '10px'
    el.style.margin = '0'
    el.style.whiteSpace = 'pre-wrap'
    el.style.font = '12px/1.4 monospace'
    el.style.color = '#fff'
    el.style.background = 'rgba(0,0,0,0.7)'
    el.style.border = '1px solid rgba(255,255,255,0.25)'
    document.body.appendChild(el)
  }
  el.textContent = lines.join('\n')
}

const logCompatibility = () => {
  if (!window.XR8 || !XR8.XrDevice) {
    return
  }

  const compatible = XR8.XrDevice.isDeviceBrowserCompatible()
  const reasons = compatible ? [] : XR8.XrDevice.incompatibleReasons()
  let reasonDetails = {}
  try {
    reasonDetails = compatible ? {} : XR8.XrDevice.incompatibleReasonDetails()
  } catch (err) {
    reasonDetails = {error: String(err)}
  }

  const lines = [
    `compatible: ${compatible}`,
    `userAgent: ${navigator.userAgent}`,
    `reasons: ${JSON.stringify(reasons)}`,
    `reasonDetails: ${JSON.stringify(reasonDetails)}`,
  ]

  console.log('[XR debug] compatibility', {compatible, reasons, reasonDetails})
  addDebugOverlay(lines)
}

const onxrloaded = () => {
  logCompatibility()

  if (XR8.addCameraPipelineModule) {
    XR8.addCameraPipelineModule({
      name: 'xr-debug-module',
      onCameraStatusChange: ({status, reason}) => {
        console.log('[XR debug] camera status', {status, reason})
      },
      onException: (error) => {
        console.error('[XR debug] pipeline exception', error)
      },
    })
  }

  XR8.XrController.configure({
    imageTargetData: [
      require('../image_targets/target1.json')],
    disableWorldTracking: true,
  })
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)