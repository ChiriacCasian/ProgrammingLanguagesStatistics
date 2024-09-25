import java.util.Objects;

public class Tile {
    public int lang ;
    public int avgSalary ;
    public int listings ;
    public int newListings ;
    public int rankingCoef ;

    public Tile(int lang, int avgSalary, int listings, int newListings){
        this.lang = lang ;
        this.avgSalary = avgSalary ;
        this.listings = listings ;
        this.newListings = newListings ;
        this.rankingCoef = getRankingCoef() ;
    }
    /// the bigger the ranking coef the better
    public int getRankingCoef(){
        return listings ;
    }

    public int getLang() {
        return lang;
    }

    public void setLang(int lang) {
        this.lang = lang;
    }

    public int getAvgSalary() {
        return avgSalary;
    }

    public void setAvgSalary(int avgSalary) {
        this.avgSalary = avgSalary;
    }

    public int getListings() {
        return listings;
    }

    public void setListings(int listings) {
        this.listings = listings;
    }

    public int getNewListings() {
        return newListings;
    }

    public void setNewListings(int newListings) {
        this.newListings = newListings;
    }

    public void setRankingCoef(int rankingCoef) {
        this.rankingCoef = rankingCoef;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tile tile = (Tile) o;
        return lang == tile.lang && avgSalary == tile.avgSalary && listings == tile.listings && newListings == tile.newListings;
    }

    @Override
    public int hashCode() {
        return Objects.hash(lang, avgSalary, listings, newListings);
    }

    @Override
    public String toString() {
        return "Tile{" +
                "lang=" + lang +
                ", avgSalary=" + avgSalary +
                ", listings=" + listings +
                ", newListings=" + newListings +
                '}';
    }
}
