import { TestRail, AddResultForCase, Test, Result } from "testrail-js-api";

import { throwOnApiError } from "../utils";
import type { Config, Video } from "../types";

export const uploadVideos = async ({
  config,
  tests,
  results,
  resultsToPush,
  videos,
  testrailAPI,
}: {
  config: Config;
  tests: Test[];
  results: Result[];
  resultsToPush: AddResultForCase[];
  videos: {
    [key: string]: Video[];
  };
  testrailAPI: TestRail;
}) => {
  if (config.uploadVideos) {
    console.log("[TestRail] Uploading videos...");
    for (let i = 0; i < resultsToPush.length; i++) {
      const test = tests.find(
        (test) => test.case_id === resultsToPush[i].case_id
      );
      const result = results.find((result) => result.test_id === test?.id);
      if (result) {
        const videoList = videos[resultsToPush[i].case_id];
        if (videoList) {
          for (let j = 0; j < videoList.length; j++) {
            await throwOnApiError(
              testrailAPI.addAttachmentToResult(
                result.id,
                videoList[j].videoPath
              )
            );
          }
        }
      } else {
        console.error(
          `[TestRail] Could not upload videos for a failed test. Case ID: ${resultsToPush[i].caseId}. Test ID: ${test?.id}`
        );
      }
    }
  }
};
