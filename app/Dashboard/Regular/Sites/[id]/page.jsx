"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  IconCpu,
  IconCloud,
  IconGlobe,
  IconThermometer,
  IconBattery3,
  IconChartBar,
} from "@tabler/icons-react";

const page = () => {
  const [result, setResult] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:4000/site/${id}`);
        const data = await response.json();
        console.log(data);
        setResult(data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      {result && (
        <>
          <div className="row row-cards mb-3">
            <div className="col-sm-6 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className={`avatar ${result?.green ? "bg-green-lt" : "bg-red-lt"}`}>
                      <IconCpu size={24} />
                    </div>
                    <div className="ms-3">
                      <div className="font-weight-medium">Rating {result?.rating}</div>
                      <div className="text-muted">
                        {result?.green ? "Eco-friendly" : "Needs improvement"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="avatar bg-blue-lt">
                      <IconCloud size={24} />
                    </div>
                    <div className="ms-3">
                      <div className="font-weight-medium">
                        {(result?.bytes / 1024 / 1024).toFixed(2)} MB
                      </div>
                      <div className="text-muted">Page Size</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="avatar bg-purple-lt">
                      <IconCloud size={24} />
                    </div>
                    <div className="ms-3">
                      <div className="font-weight-medium">
                        {result?.statistics?.co2?.grid?.grams.toFixed(2)}g
                      </div>
                      <div className="text-muted">CO2 Grid</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="avatar bg-green-lt">
                      <IconGlobe size={24} />
                    </div>
                    <div className="ms-3">
                      <div className="font-weight-medium">
                        {(result?.cleanerThan * 100).toFixed(0)}%
                      </div>
                      <div className="text-muted">Cleaner Than</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Detailed Statistics</h3>
            </div>
            <div className="card-body pb-0">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="avatar bg-orange-lt">
                          <IconThermometer size={24} />
                        </div>
                        <div className="ms-3">
                          <div className="font-weight-medium">Energy Consumption</div>
                          <div className="text-muted">
                            {result?.statistics?.energy.toFixed(4)} kWh
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="avatar bg-blue-lt">
                          <IconBattery3 size={24} />
                        </div>
                        <div className="ms-3">
                          <div className="font-weight-medium">Adjusted Bytes</div>
                          <div className="text-muted">
                            {(result?.statistics?.adjustedBytes / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="avatar bg-purple-lt">
                          <IconCloud size={24} />
                        </div>
                        <div className="ms-3">
                          <div className="font-weight-medium">CO2 Renewable</div>
                          <div className="text-muted">
                            {result?.statistics?.co2?.renewable?.grams.toFixed(2)}g
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="avatar bg-green-lt">
                          <IconChartBar size={24} />
                        </div>
                        <div className="ms-3">
                          <div className="font-weight-medium">CO2 Volume</div>
                          <div className="text-muted">
                            {result?.statistics?.co2?.grid?.litres.toFixed(2)} litres
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default page;