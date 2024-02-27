import { useEffect, useState } from "react";
import axios from "axios";
import { ServiceRequest } from "common/src/serviceRequestTypes.ts";
import { useAuth0 } from "@auth0/auth0-react";

export default function CountEmergency() {
  const [srData, setsrData] = useState<ServiceRequest[]>([]);
  const [countOfEmergencyRequests, setCountOfEmergencyRequests] =
    useState<number>(0);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken: string = await getAccessTokenSilently();
        const response = await axios.get<ServiceRequest[]>(
          "/api/service-request",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setsrData(response.data);
      } catch (error) {
        console.error("Error fetching service request data", error);
        // You can handle errors by setting some state variable here
      }
    }

    fetchData().then();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    const count = srData.filter(
      (request) => request.priority === "Emergency",
    ).length;
    setCountOfEmergencyRequests(count);
  }, [srData]);

  return countOfEmergencyRequests;
}
