import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatchOdds } from "../../../store/slices/matchSlice";
import OddsTable from "./OddsTable";

const MatchOddsTable = () => {
       const dispatch = useDispatch();
       const { matchOdds, loading, error } = useSelector((state) => state.match);

       useEffect(() => {
              dispatch(fetchMatchOdds());
       }, [dispatch]);

       if (loading) {
              return <p className="text-center text-gray-500">Loading match odds...</p>;
       }

       if (error) {
              return <p className="text-center text-red-500">{error}</p>;
       }

       return (
              <div>
                     {matchOdds && matchOdds.length > 0 ? (
                            <OddsTable data={matchOdds} />
                     ) : (
                            <p className="text-center text-gray-500">No match odds available</p>
                     )}
              </div>
       );
};

export default MatchOddsTable;
