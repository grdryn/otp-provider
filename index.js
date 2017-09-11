"use strict";

/*
  Copyright 2017 Red Hat, Inc., and individual contributors

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const express = require('express');
const speakeasy = require('speakeasy');

const app = express();
const port = process.env.PORT || 3000;

function getToken(secret) {
  return speakeasy.totp({
    secret: secret,
    encoding: 'base32'
  });
};

app.get('/:service/:id', function getServiceId(req, res) {
  const id = req.params.id.toUpperCase().replace(/[\.-]/g, '_');
  const service = req.params.service.toUpperCase().replace(/[\.-]/g, '_');
  const secret = process.env[`SECRET_${service}_${id}`];

  if (secret) {
    res.end(getToken(secret));
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, function myAppListener() {
  console.log(`otp-provider app listening on port ${port}!`);
});
