-- CREATE STORE PROCEDURES FOR DASHBOARD GRAPHICS 

DROP PROCEDURE IF EXISTS REPORT_CHART_STATUS_DOCUMENT;
DELIMITER //
CREATE PROCEDURE `REPORT_CHART_STATUS_DOCUMENT` (initDate varchar(10) , endDate varchar(10))
BEGIN
SELECT 
  DISTINCT( DATE_FORMAT( convert_tz(status.registerDate ,@@session.time_zone,'-05:00') ,"%Y-%m-%d")) AS 'date',
	COUNT(CASE WHEN status.status = 'register' THEN 1 END) AS 'register',
	COUNT(CASE WHEN status.status = 'processing' THEN 1 END) AS 'processing',
	COUNT(CASE WHEN status.status = 'observed' THEN 1 END) AS 'observed',
    COUNT(CASE WHEN status.status = 'finalized' THEN 1 END) AS 'finalized'
  FROM  status           
  WHERE DATE_FORMAT( convert_tz(status.registerDate ,@@session.time_zone,'-05:00') ,"%Y-%m-%d")  BETWEEN initDate AND endDate
  GROUP BY DATE_FORMAT( convert_tz(status.registerDate ,@@session.time_zone,'-05:00') ,"%Y-%m-%d");
END//
DELIMITER ;



DROP PROCEDURE IF EXISTS REPORT_CHART_STATUS_DOCUMENT_BY_ID_DOCUMENT;
DELIMITER //
CREATE PROCEDURE `REPORT_CHART_STATUS_DOCUMENT_BY_ID_DOCUMENT` (id varchar(12) ,initDate varchar(10) , endDate varchar(10))
BEGIN
SELECT 
  DISTINCT( DATE_FORMAT( convert_tz(status.registerDate ,@@session.time_zone,'-05:00') ,"%Y-%m-%d")) AS 'date',
	COUNT(CASE WHEN status.status = 'register' THEN 1 END) AS 'register',
	COUNT(CASE WHEN status.status = 'processing' THEN 1 END) AS 'processing',
	COUNT(CASE WHEN status.status = 'observed' THEN 1 END) AS 'observed',
    COUNT(CASE WHEN status.status = 'finalized' THEN 1 END) AS 'finalized'
  FROM  status 
  JOIN status_document 
  ON status.idStatusDocument = status_document.idStatusDocument
  JOIN  document
  ON document.idDocument=status_document.idDocument
  WHERE document.idDocument = id AND  DATE_FORMAT( convert_tz(status.registerDate ,@@session.time_zone,'-05:00') ,"%Y-%m-%d")  BETWEEN initDate AND endDate
  GROUP BY DATE_FORMAT( convert_tz(status.registerDate ,@@session.time_zone,'-05:00') ,"%Y-%m-%d");
END//
DELIMITER ;
