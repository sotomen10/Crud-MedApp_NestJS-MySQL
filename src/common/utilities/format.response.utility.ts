export function formatResponse(data: any, message: string = 'Success', status: number = 200) {
    return {
      statusCode: status,
      message,
      data,
    };
  }