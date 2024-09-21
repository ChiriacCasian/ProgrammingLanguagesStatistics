import java.sql.*;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> cityList = List.of(
                "other",
                "Drenthe",
                "Flevoland",
                "Friesland",
                "Gelderland",
                "Groningen",
                "Limburg",
                "North Brabant",
                "North Holland",
                "Overijssel",
                "South Holland",
                "Utrecht",
                "Zeeland"
        );
        List<Lang> programmingLanguages = List.of(
                new Lang(0, "other"), /// mistery language
                new Lang(1, "Java"),
                new Lang(2, "javascript"),
                new Lang(3, "python"),
                new Lang(4, "c++"),
                new Lang(5, "kotlin"),
                new Lang(6, "c#"),
                new Lang(7, "swift"),
                new Lang(8, "php"),
                new Lang(9, "ruby"),
                new Lang(10, "sql"),
                new Lang(11, "html"),
                new Lang(12, "r"),
                new Lang(13, "go"),
                new Lang(14, "rust"),
                new Lang(15, "scala"),
                new Lang(16, "dart"),
                new Lang(17, "matlab"),
                new Lang(18, "cobol")
        ) ;
        for(Lang lang : programmingLanguages){
            lang.updateAvgSalary(cityList) ;
            System.out.println(lang);
        }

    }
}