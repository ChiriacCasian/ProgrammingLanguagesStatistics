package backend.java.DataLoader.Commons;

import backend.java.DataLoader.DatabaseClient.DBClient;

import java.util.ArrayList;
import java.util.List;

public class TileClient implements ClientInterface<Tile>{
    private static TileClient tileInstance ;
    private final List<String> Languages = List.of(
            "none",
            "java",
            "javascript",
            "python",
            "c++",
            "kotlin",
            "c#",
            "swift",
            "php",
            "ruby",
            "sql",
            "html",
            "r",
            "go",
            "rust",
            "scala",
            "dart",
            "matlab",
            "cobol"
    ) ;
    private final int NrOfCountries = 3 ;
    private List<List<Tile>> cachedTiles = new ArrayList<>() ;

    public List<Tile> getByCountryCode(int countryCode){
        return cachedTiles.get(countryCode) ;
    }
    public void cacheTiles() {
        for(int f = 0 ; f < NrOfCountries ; f ++){
            cachedTiles.add(getByCountryCodeLocal(f)) ;
        }
    }
    public List<Tile> getByCountryCodeLocal(int countryCode){

        List<Tile> rezlist = new ArrayList<>() ;
        rezlist.add(new Tile("none", 0, 0, 0, 0)) ;

        for(int f = 1 ; f < Languages.size() ; f ++){
            int avgSalary = DBClient.queryDb(String.format("""
                    SELECT avg(salary)
                    FROM indeed_db.jobstable
                    WHERE lang = %d
                    AND country = %d
                    """, f, countryCode));
            int listings = DBClient.queryDb(String.format("""
                    SELECT count(id)
                    FROM indeed_db.jobstable
                    WHERE lang = %d
                    AND country = %d
                    """, f, countryCode));
            int newListings = DBClient.queryDb(String.format("""
                    SELECT count(id)
                    FROM indeed_db.jobstable
                    WHERE lang = %d
                    AND country = %d
                    AND date BETWEEN DATE_SUB(CURDATE(), INTERVAL 390 DAY) AND CURDATE();
                    """, f, countryCode)) / 8;
            rezlist.add(new Tile(Languages.get(f), f, avgSalary, listings, newListings)) ;
        }
        double avgSalary = (double)rezlist.stream().mapToInt(x -> x.getAvgSalary()).sum() / rezlist.size() ;
        double avgListings = (double)rezlist.stream().mapToInt(x -> x.getNewListings()).sum() / rezlist.size() ;
        for(Tile tile : rezlist){
            tile.setRankingCoef(
                    (int) (tile.getAvgSalary() / avgSalary * 60 +
                            tile.getListings() / avgListings * 40)
            );
        }
        return rezlist;
    }

    private TileClient() {}

    public static synchronized TileClient getInstance() {
        if (tileInstance == null) {
            tileInstance = new TileClient();
        }
        return tileInstance;
    }
}
