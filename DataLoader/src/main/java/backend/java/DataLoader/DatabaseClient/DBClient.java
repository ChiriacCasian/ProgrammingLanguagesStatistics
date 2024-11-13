package backend.java.DataLoader.DatabaseClient;

import backend.java.DataLoader.Commons.Tile;

import java.sql.*;
import java.util.*;

public class DBClient {
    private static class DbConnection{ /// BE CAREFUL TO CALL db.endConnection() AFTER USING IT !!!
        private Connection conn ;
        private Statement statement;
        public DbConnection(Connection conn, Statement statement){
            this.conn = conn;
            this.statement = statement;
        }
        public Optional<ResultSet> getResultSet(String sqlQuery) {
            ResultSet resultSet;
            try {
                resultSet = statement.executeQuery(sqlQuery);
                return Optional.of(resultSet);
            } catch (SQLException e) {
                e.printStackTrace();
            }
            return Optional.empty();
        }
        public void endConnection() {
            try {
                if (statement != null) statement.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    private static Optional<DbConnection> connectToDb(
            String port, String database_name, String username, String password) {

        String url = String.format("jdbc:mysql://localhost:%S/%S", port, database_name);  // Replace with your database URL
        Connection conn = null;
        Statement statement = null;
        try {
            conn = DriverManager.getConnection(url, username, password);
            statement = conn.createStatement();
            return Optional.of(new DbConnection(conn, statement));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    public static int queryDb(String sqlQuery) { ///
        /// List.of("id", "lang", "assoc_lang", "city", "salary", "date", "lvl")
        try {
            DbConnection db = connectToDb("3406", "indeed_db", "root", "12345rita").get();

            ResultSet resultSet = db.getResultSet(sqlQuery).get();
            resultSet.next() ; /// position the cursor before reading the data

            int result = resultSet.getInt(1) ;
            db.endConnection();
            return result ;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return -1 ;
    }

    public static List<Integer> queryDbAvgSalaryByLang(int cityCode, int countryCode, List<String> languages) { /// for each language
        List<Integer> avgSalaryList = new ArrayList<>() ;
        int f = 1 ;
        for(String lang : languages){
            avgSalaryList.add(queryDb(String.format("""
                    SELECT avg(salary)
                    FROM indeed_db.jobstable
                    WHERE country = %d
                    AND city = %d
                    AND lang = %d
                    """, countryCode, cityCode, f))) ;
            f += 1 ;
        }
        return avgSalaryList ;
    }

    public static List<Integer> queryDbListingsByLang(int cityCode, int countryCode, List<String> languages) {
        List<Integer> listingsByLang = new ArrayList<>() ;
        int f = 1 ;
        for(String lang : languages){
            listingsByLang.add(queryDb(String.format("""
                    SELECT count(id)
                    FROM indeed_db.jobstable
                    WHERE country = %d
                    AND city = %d
                    AND lang = %d
                    """, countryCode, cityCode, f))) ;
            f += 1 ;
        }
        return listingsByLang ;
    }

//    public static int update_avgSalaryByProvince(int lang, String province) { ///
//        try {
//            DbConnection db = connectToDb("3406", "indeed_db", "root", "12345rita").get();
//            String sqlQuery = String.format("""
//            SELECT avg(salary) FROM jobstable
//            WHERE lang = %d and city = '%s'
//            """, lang, province);
//            ResultSet resultSet = db.getResultSet(sqlQuery).get();
//            resultSet.next(); /// Do not forget to always position the cursor before reading the data !!
//            int salary = resultSet.getInt(1) ;
//            db.endConnection();
//            return salary ;
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return -1 ;
//    }
}

