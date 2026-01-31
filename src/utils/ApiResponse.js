class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }

    static success(data, message = "Success") {
        return new ApiResponse(200, data, message);
    }

    static created(data, message = "Created successfully") {
        return new ApiResponse(201, data, message);
    }
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
          success: true,
          statusCode,
          message,
          data,
        });
      }
    
      static created(res, data, message = 'Created successfully') {
        return res.status(201).json({
          success: true,
          statusCode: 201,
          message,
          data,
        });
      }
    
      static error(res, message = 'Error', statusCode = 500, errors = null) {
        const response = {
          success: false,
          statusCode,
          message,
        };
        
        if (errors) {
          response.errors = errors;
        }
        
        return res.status(statusCode).json(response);
      }
    }


export default ApiResponse;