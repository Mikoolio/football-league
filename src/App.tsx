import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.scss";

interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
}

interface League {
  idLeague: string;
  strLeague: string; // Add the strLeague property
}

interface Season {
  strSeason: string;
}

const App: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);

  useEffect(() => {
    // Fetch list of leagues from the API
    axios
      .get("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php")
      .then((response) => {
        const firstFiveLeagues = response.data.leagues.slice(0, 5);
        setLeagues(firstFiveLeagues);
      })
      .catch((error) => {
        console.error("Error fetching leagues:", error);
      });
  }, []);

  const handleTabClick = (leagueId: string) => {
    // Fetch seasons for the selected league from the API
    axios
      .get(
        `https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?id=${leagueId}`
      )
      .then((response) => {
        const fetchedSeasons = response.data.seasons || [];
        setSeasons(fetchedSeasons);
      })
      .catch((error) => {
        console.error("Error fetching seasons:", error);
      });

    setSelectedLeague(leagueId);
  };

  return (
    <div className="app">
      <nav>
        <ul>
          {leagues.map((league) => (
            <li
              key={league.idLeague}
              onClick={() => handleTabClick(league.idLeague)}
            >
              {league.strLeague}
            </li>
          ))}
        </ul>
      </nav>

      <div className="seasons">
        {selectedLeague && (
          <ul>
            {seasons.map((season) => (
              <li key={season.strSeason}>{season.strSeason}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
