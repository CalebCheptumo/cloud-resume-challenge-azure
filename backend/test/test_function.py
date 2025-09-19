import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import pytest
from unittest.mock import Mock, patch
import json
from function_app import VisitorsHttpsTrigger, increment_and_get_count

class TestVisitorsHttpsTrigger:
    def test_returns_json_count(self):
        # Mock the request
        mock_req = Mock()
        mock_req.params.get.return_value = None
        mock_req.get_json.return_value = None
        
        # Mock the increment function
        with patch('function_app.increment_and_get_count', return_value=42):
            result = VisitorsHttpsTrigger(mock_req)
            
        assert result.status_code == 200
        data = json.loads(result.get_body())
        assert data["count"] == 42

class TestIncrementAndGetCount:
    @patch('function_app.TableClient')
    def test_increments_count(self, mock_table_client):
        # Mock table operations
        mock_client = Mock()
        mock_table_client.from_connection_string.return_value = mock_client
        
        # Mock existing entity
        mock_client.get_entity.return_value = {"PartitionKey": "counter", "RowKey": "global", "count": 5}
        
        result = increment_and_get_count()
        
        assert result == 6
        mock_client.upsert_entity.assert_called()