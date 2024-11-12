package backend.java.DataLoader.Commons;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.List;
import java.util.Objects;

@JsonSerialize
public class Tile {
    public String name ;
    public int lang ;
    public int avgSalary ;
    public int listings ;
    public int newListings ;
    public int rankingCoef ;

    public Tile(String name, int lang, int avgSalary, int listings, int newListings) {
        this.name = name ;
        this.lang = lang;
        this.avgSalary = avgSalary;
        this.listings = listings;
        this.newListings = newListings;
        this.rankingCoef = 0;
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

    public int getRankingCoef() {
        return rankingCoef;
    }

    public void setRankingCoef(int rankingCoef) {
        this.rankingCoef = rankingCoef;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Tile tile)) return false;
        return lang == tile.lang && avgSalary == tile.avgSalary && listings == tile.listings && newListings == tile.newListings && rankingCoef == tile.rankingCoef;
    }

    @Override
    public int hashCode() {
        return Objects.hash(lang, avgSalary, listings, newListings, rankingCoef);
    }

    @Override
    public String toString() {
        return "Tile{" +
                "lang=" + lang +
                ", avgSalary=" + avgSalary +
                ", listings=" + listings +
                ", newListings=" + newListings +
                ", rankingCoef=" + rankingCoef +
                '}';
    }
}
