import AWSXRay from 'aws-xray-sdk-core'
import * as AWSType from 'aws-sdk'
import http from 'http'
import https from 'https'

let AWS = AWSType

if (process.env.IS_OFFLINE == null) {
  AWSXRay.captureHTTPsGlobal(http)
  AWSXRay.captureHTTPsGlobal(https)
  AWS = AWSXRay.captureAWS(AWSType)
}

export { AWSType, AWS }
