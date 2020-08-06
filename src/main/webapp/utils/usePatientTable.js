import _ from "lodash";
import { useState, useCallback } from "use-react-hooks";
import useApi from "./useApi";

export default function useContactsTable() {
  // Though this is a GET, use a POST & method override because the sorted and
  // filtered params are complex (arrays of objects) for easier parsing.
  const url =
    "https://filtering-sorting-paging-api--mrleebo.repl.co/?_method=GET";
  const [gridState, setGridState] = useState();
  const { results, loading, error, refetch, invalidate } = useApi(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gridState)
  });

  // Debounce state changes to reduce the spam when filtering
  const onFetchData = useCallback(
    _.debounce(state => {
      const { page, pageSize, sorted, filtered } = state;
      setGridState({ page: page + 1, per: pageSize, sorted, filtered });
    }, 80)
  );

  return {
    gridState: {
      defaultPageSize: 10,
      data: _.get(results, "collection", []),
      pages: _.get(results, "meta.pages", 0),
      filterable: true,
      manual: true,
      onFetchData,
      loading
    },
    error,
    refetch,
    invalidate
  };
}
