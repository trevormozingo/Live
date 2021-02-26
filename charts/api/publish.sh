helm package .
curl -v --data-binary @api-0.1.0.tgz http://localhost:8080/api/charts