# ZKEVM lens API load testing

Demonstrates how to run load tests with containerised instances of K6, Grafana and InfluxDB.

### Source

The setup has been borrowed from the following repository:
https://github.com/luketn/docker-k6-grafana-influxdb

There's also a related article https://medium.com/swlh/beautiful-load-testing-with-k6-and-docker-compose-4454edb3a2e3

## How to run

- You must be at /k6 level in the lineaster repository
- run `chmod +x k6/run-load-test.sh` to allow script execution
- open Grafana dashboard at http://localhost:3000/d/k6/k6-load-testing-results in your browser
- run `./k6/run-load-test.sh` in your terminal. This will spin up Grafana dashboard and DB, then run specified test file
- check results inside Grafana dashboard

<!-- ## How to add more test
A k6 test file is composed of:
-  -->
