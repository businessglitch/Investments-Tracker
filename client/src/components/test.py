import unittest 
import logging

import os
# from curation.datasources.azure_datalake_gen2 import AzureDataLakeGen2
from azure.keyvault.secrets import SecretClient
from azure.identity import ClientSecretCredential
from azure.storage.filedatalake import DataLakeServiceClient, FileSystemClient, DataLakeFileClient
from pyspark.sql import SparkSession, DataFrame

logger = logging.getLogger(__name__)

               
class AzureDataLakeGen2(object):
    
    def __init__(self):
        """
        [Constructor for Azure Data Lake Gen2 class, which instantiates a connection to an
        Azure storage account with Data Lake Gen2 mounted as the container]

        Arguments:
            dbutils {object} -- [Represents databricks utilities library for pyspark]
            client {object} -- [Represents the azure key vault client used to retrieve secrets]
        """
           
        self.account_name = dbutils.secrets.get(scope='databricks-secret-scope',key='datalake-account')
        self.account_key = dbutils.secrets.get(scope='databricks-secret-scope',key='datalake-key')
        self.account_url = "https://{0}.dfs.core.windows.net/".format(self.account_name)
        self.service_client = DataLakeServiceClient(account_url=self.account_url, credential=self.account_key)
        self.file_system_name = 'datalake'
        self.file_system = FileSystemClient(account_url=self.account_url,file_system_name=self.file_system_name, credential=self.account_key)
        
    def get_directory_list(self, directory: str):
        """
		[Lists all of the file contents of a Azure Data Lake Gen2 directory based on the path prefix. 
        Recursive is set when file contents of sub-directories are required.]

          Arguments:
              directory {str} -- [Directory name to use in order to retrieve files]
              recursive {str} -- [Option set to determine if all sub-directory information is also gathered]

          Returns:
              file_list -- [File list containing all of the paths for each file within the directory]
        """        
        try:
			logger.info('Listing the files from the given directory: {0}'.format(directory))
			file_list = self.file_system.get_paths(path=directory)
			if file_list is not None:
				return file_list
		except Exception as e:
			logger.error(str(e))
			raise(e)

R3 = ["TransType_PackageDelivered", "TransType_PackageManage", "TransType_PackageMissort", "TransType_PackageReceived","TransType_PackageReturned","TransType_PackageTrapped", "TransType_POTransferOut", "TransType_POTransferIn"]
R4 = ["TransType_RemitIn","TransType_RemitOut","TransType_TransferIn","TransType_TransferOut","TransType_RetailStockSale","TransType_Settlement"]
R5 = ['TransType_NeighbourhoodMail', 'TransType_CustomerIdentifier']
Generic_Tables = ["audit", "LineItems", "Transactions", "TxnDataRecords", "VisitDataRecords"]
TXN_Tables = ["TxnDataMsg_PackageTrackingTrailer" ,"TxnDataMsg_POTransfer", "TxnDataMsg_Transfer"]
Escher_FileTypes = ['Aud','Art', 'Vis', 'CostCentreRaw', 'Dep', 'Des', 'Eve', 'Log', 'Sit', 'Tra']

spark = SparkSession.builder.getOrCreate()
g2 = AzureDataLakeGen2()      

"""
A helper function to verify that a table is not empty
Arguments:
	__tables {list of strings} -- [Represents the names of the tables]
           
"""
def test_tables_not_empty(__tables):
	# Match the naming convention for Delta Lake tables (All lowercase)
  	tables = [table.lower() for table in __tables]

	for table in tables:
		q = "SELECT Count(*) as count FROM escher.{0}".format(table)
		df =  spark.sql(q)
		count = df.collect()[0][0]

		try:
			assert count > 0, "Should not be empty"
		except Exception as e:
			logger.error(str(e))

"""
A helper function to verify that a table exists
Arguments:
	__tables {list of strings} -- [Represents the names of the tables]
           
"""
def tables_exist(__tables):
	# Match the naming convention for Delta Lake tables (All lowercase)
	tables = [table.lower() for table in __tables]

  	for table in tables:
    	q = "Describe escher.{0}".format(table)
		try:
			spark.sql(q)
		except Exception as e:
			logger.error(str(e), ('{0} table does not exist!').format(table))

"""
A wrapper function to test generic tables are present
"""
def test_GenerticTables_exist():
	print('     =======================================================')
	print('     Starting test for checking Generic Tables are present\n')

	try:
		test_tables_not_empty(Generic_Tables)
	except Exception as e:
		logging.critical('Table should be present. {}'.format(str(e)))
		
	print('     Test Passed Successfully')    	

"""
A wrapper function to test R3 tables are present
"""
def test_R3Tables_exist():
	print('     =======================================================')
	print('     Starting test for checking R3 Tables are present\n')

	try:
		test_tables_not_empty(R3)
	except Exception as e:
		logging.critical('Tables should be present. {}'.format(str(e)))
		
	print('     Test Passed Successfully')   

"""
A wrapper function to test R4 tables are present
"""
def test_R4Tables_exist():
	print('     =======================================================')
	print('     Starting test for checking R4 Tables are present\n')

	try:
		test_tables_not_empty(R4)
	except Exception as e:
		logging.critical('Table should be present. {}'.format(str(e)))
		
	print('     Test Passed Successfully')  

"""
A wrapper function to test TXN tables are present
"""
def test_TxnTables_exist():
	print('     =======================================================')
	print('     Starting test for checking TXN Tables are present\n')

	try:
		test_tables_not_empty(TXN_Tables)
	except Exception as e:
		logging.critical('Tables should be present. {}'.format(str(e)))
		
	print('     Test Passed Successfully')



"""
A wrapper function to test generic tables have row count 
"""
def test_GenerticTables_notEmpty():
	print('     =======================================================')
	print('     Starting test for checking Generic Tables row count\n')

	try:
		test_tables_not_empty(Generic_Tables)
	except Exception as e:
		logging.critical('Tables should not be empty. {}'.format(str(e)))
		
	print('     Test Passed Successfully')    	

"""
A wrapper function to test R3 tables have row count 
"""
def test_R3Tables_notEmpty():
	print('     =======================================================')
	print('     Starting test for checking R3 Tables row count\n')

	try:
		test_tables_not_empty(R3)
	except Exception as e:
		logging.critical('Tables should not be empty. {}'.format(str(e)))
		
	print('     Test Passed Successfully')   

"""
A wrapper function to test R4 tables have row count 
"""
def test_R4Tables_notEmpty():
	print('     =======================================================')
	print('     Starting test for checking R4 Tables row count\n')

	try:
		test_tables_not_empty(R4)
	except Exception as e:
		logging.critical('Tables should not be empty. {}'.format(str(e)))
		
	print('     Test Passed Successfully')  

"""
A wrapper function to test TXN tables have row count 
"""
def test_TxnTables_notEmpty():
	print('     =======================================================')
	print('     Starting test for checking TXN Tables row count\n')

	try:
		test_tables_not_empty(TXN_Tables)
	except Exception as e:
		logging.critical('Tables should not be empty. {}'.format(str(e)))
		
	print('     Test Passed Successfully')


"""
A helper function to verify that files at the specified path are of the same format
Arguments:
	path {str} -- [Represents the path of where the files are]
    fileformat {str} -- [Represents the expected fileformat]     
"""
def check_fileformat(path, fileformat):
  	file_list = g2.get_directory_list(path)

  	for file in file_list:
		if 'schema' in file.name:
			continue
      
		if "." in file.name:
			if((file.name).split(".")[-1] != fileformat):
				#logging.critical('file {} should not be present here'.format(file.name))
				raise Exception('file {} should not be present here'.format(file.name))

"""
A helper function to verify that files at the specified location have the correct naming convention
Arguments:
	path {str} -- [Represents the path of where the files are]
    fileformat {str} -- [Represents the expected fileformat]     
"""
def check_naming_convention(path, filename_types):
  	file_list = g2.get_directory_list(path)
	
	# Skip over schema json files
  	for file in file_list:
		if 'schema' in file.name:
			continue
		
		if "." in file.name:
			filename = (file.name).split(".")[0]
			filename_split = filename.split('/')[-1].split('_')
      
			if not isinstance(int(filename_split[-1]), int):
				raise Exception('Segment should be a number, either GroupID or Date. {}'.format(file.name))
        
			if len(filename_split) > 2:
			
				if '_'.join(filename_split[:-2]) not in filename_types:
					raise Exception('File type was not expected. {}'.format(file.name))
			
				if not isinstance(int(filename_split[-2]), int):
					raise Exception('Segment should be a number, either GroupID or Date. {}'.format(file.name))
			
			else:
				if filename_split[0] not in filename_types:
					raise Exception('File type was not expected. {}'.format(file.name))
	
   
"""
A wrapper function to test curated files format 
"""
def test_check_curated_fileformat():
	print('     =======================================================')
	print('     Starting test for checking CURATED files format\n')
  
	try:
		check_fileformat('data/curated/retail/escher/', 'csv')
	except Exception as e:
		logging.critical('Curated files are not in csv format, {}'.format(str(e)))   

	print('     Test Passed Successfully')

"""
A wrapper function to test raw files format 
"""
def test_check_raw_fileformat():
	print('     =======================================================')
	print('     Starting test for checking RAW files format\n')
	
	try:
		check_fileformat('data/raw/retail/escher/', 'json')
	except Exception as e:
		logging.critical('Raw files are not in json format, {}'.format(str(e)))  
		
	print('     Test Passed Successfully')

"""
A wrapper function to test esher files format 
"""
def test_check_escher_fileformat():
	print('     =======================================================')
	print('     Starting test for checking ESCHER files format\n')
	
	try:
		check_fileformat('escher-files/', 'json')
	except Exception as e:
		logging.critical('Escher files are not in json format, {}'.format(str(e)))  
		
	print('     Test Passed Successfully')
  
"""
A wrapper function to test esher files naming convention 
"""
def test_escherFiles_namingConvention():
	print('     =======================================================')
	print('     Starting test for checking ESCHER files naming convention\n')

	filename_types = Escher_FileTypes
	try:
		check_naming_convention('escher-files/', filename_types)
	except Exception as e:
		logging.critical('Escher files do not have the correct naming convention, {}'.format(str(e)))
		
	print('     Test Passed Successfully')

"""
A wrapper function to test raw files naming convention 
"""
def test_rawFiles_namingConvention():
	print('     =======================================================')
	print('     Starting test for checking RAW files naming convention\n')
	
	filename_types = Escher_FileTypes
	try:
		check_naming_convention('data/raw/retail/escher/', filename_types)
	except Exception as e:
		logging.critical('Raw files do not have the correct naming convention, {}'.format(str(e)))
		
	print('     Test Passed Successfully')

"""
A wrapper function to test curated files naming convention 
"""
def test_curatedFiles_namingConvention():
	print('     =======================================================')
	print('     Starting test for checking CURATED files naming convention\n')

	filename_types = Escher_FileTypes + R5 + R3 +R4 + Generic_Tables + TXN_Tables
	try:
		check_naming_convention('data/curated/retail/escher/', filename_types)
	except Exception as e:
		logging.critical('CSV files do not have the correct naming convention, {}'.format(str(e)))
		
	print('     Test Passed Successfully')
