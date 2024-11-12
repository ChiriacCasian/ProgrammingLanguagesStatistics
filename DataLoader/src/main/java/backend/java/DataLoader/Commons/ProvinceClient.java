package backend.java.DataLoader.Commons;

import backend.java.DataLoader.DatabaseClient.DBClient;

import java.util.ArrayList;
import java.util.List;

public class ProvinceClient implements ClientInterface<Province> {
    private static ProvinceClient provinceClient ;
    private final List<String> NlProvinces = List.of(
            "none",
            "Drenthe",
            "Flevoland",
            "Friesland",
            "Gelderland",
            "Groningen",
            "Limburg",
            "North-Brabant",
            "North-Holland",
            "Overijssel",
            "South-Holland",
            "Utrecht",
            "Zeeland");
    private final List<String> DeProvinces = List.of(
            "none",
            "Baden-Wurttemberg",
            "Bayern",
            "Berlin",
            "Brandenburg",
            "Bremen",
            "Hamburg",
            "Hessen",
            "Niedersachsen",
            "Mecklenburg-Vorpommern",
            "Nordrhein-Westfalen",
            "Rheinland-Pfalz",
            "Saarland",
            "Sachsen",
            "Sachsen-Anhalt",
            "Schleswig-Holstein",
            "Thuringen") ;
    private final List<String> UsaProvinces = List.of(
            "none",
            "Alabama",
            "Alaska",
            "Arizona",
            "Arkansas",
            "California",
            "Colorado",
            "Connecticut",
            "Delaware",
            "Florida",
            "Georgia",
            "Hawaii",
            "Idaho",
            "Illinois",
            "Indiana",
            "Iowa",
            "Kansas",
            "Kentucky",
            "Louisiana",
            "Maine",
            "Maryland",
            "Massachusetts",
            "Michigan",
            "Minnesota",
            "Mississippi",
            "Missouri",
            "Montana",
            "Nebraska",
            "Nevada",
            "New-Hampshire",
            "New-Jersey",
            "New-Mexico",
            "New-York",
            "North-Carolina",
            "North-Dakota",
            "Ohio",
            "Oklahoma",
            "Oregon",
            "Pennsylvania",
            "Rhode-Island",
            "South-Carolina",
            "South-Dakota",
            "Tennessee",
            "Texas",
            "Utah",
            "Vermont",
            "Virginia",
            "Washington",
            "West-Virginia",
            "Wisconsin",
            "Wyoming"
    ) ;
    private final List<List<String>> ProvinceNameList = List.of(
            NlProvinces,
            DeProvinces,
            UsaProvinces
    );
    private final int NrOfCountries = 3 ;
    private List<List<Province>> cachedProvinces = new ArrayList<>() ;

    private ProvinceClient(){}

    public synchronized static ProvinceClient getInstance() {
        if(provinceClient == null){
            provinceClient = new ProvinceClient() ;
        }
        return provinceClient ;
    }

    public List<Province> getByCountryCode(int countryCode){
        return cachedProvinces.get(countryCode) ;
    }
    public void cacheProvinces(){
        for(int f = 0 ; f < NrOfCountries ; f ++){
            cachedProvinces.add(getByCountryCodeLocal(f)) ;
        }
    }
    public List<Province> getByCountryCodeLocal(int countryCode){
        List<String> provincesNames = ProvinceNameList.get(countryCode) ;
        List<Province> provincesRez = new ArrayList<>() ;
        provincesRez.add(new Province("none", 0, 0, 0, new ArrayList<>(), new ArrayList<>())) ;
        for(int f = 1 ; f < provincesNames.size() ; f ++){
            String name = provincesNames.get(f) ;
            int id = f ;
            int avgSalary = DBClient.queryDb(String.format("""
                    SELECT avg(salary)
                    FROM indeed_db.jobstable
                    WHERE country = %d
                    AND city = %d
                    """, countryCode, f)) ;
            int listings = DBClient.queryDb(String.format("""
                    SELECT count(id)
                    FROM indeed_db.jobstable
                    WHERE country = %d
                    AND city = %d
                    """, countryCode, f)) ;
            List<Integer> avgSalaryByLang = DBClient.queryDbAvgSalaryByLang(f, countryCode) ;
            List<Integer> listingsByLang = DBClient.queryDbListingsByLang(f, countryCode) ;
            provincesRez.add(new Province(name, id, avgSalary, listings, avgSalaryByLang, listingsByLang)) ;
        }
        provincesRez.get(0).setAvgSalaryByLang(provincesRez.get(1).getAvgSalaryByLang());
        provincesRez.get(0).setListingsByLang(provincesRez.get(1).getListingsByLang());
        return provincesRez ;
    }
}
