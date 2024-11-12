package backend.java.DataLoader.Commons;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.List;
import java.util.Objects;

@JsonSerialize
public class Province {
    String name ;
    int id ;
    int avgSalary ;
    int listings ;
    @JsonProperty("avgSalaryByLang")
    public List<Integer> avgSalaryByLang ;
    @JsonProperty("listingsByLang")
    public List<Integer> listingsByLang ;

    public Province(String name, int id, int avgSalary, int listings, List<Integer> avgSalaryByLang, List<Integer> listingsByLang) {
        this.name = name;
        this.id = id;
        this.avgSalary = avgSalary;
        this.listings = listings;
        this.avgSalaryByLang = avgSalaryByLang;
        this.listingsByLang = listingsByLang;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public List<Integer> getAvgSalaryByLang() {
        return avgSalaryByLang;
    }

    public void setAvgSalaryByLang(List<Integer> avgSalaryByLang) {
        this.avgSalaryByLang = avgSalaryByLang;
    }

    public List<Integer> getListingsByLang() {
        return listingsByLang;
    }

    public void setListingsByLang(List<Integer> listingsByLang) {
        this.listingsByLang = listingsByLang;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Province province)) return false;
        return id == province.id && avgSalary == province.avgSalary && listings == province.listings && Objects.equals(name, province.name) && Objects.equals(avgSalaryByLang, province.avgSalaryByLang) && Objects.equals(listingsByLang, province.listingsByLang);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, id, avgSalary, listings, avgSalaryByLang, listingsByLang);
    }

    @Override
    public String toString() {
        return "Province{" +
                "name='" + name + '\'' +
                ", id=" + id +
                ", avgSalary=" + avgSalary +
                ", listings=" + listings +
                ", avgSalaryByLang=" + avgSalaryByLang +
                ", listingsByLang=" + listingsByLang +
                '}';
    }
}
