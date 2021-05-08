class HumusBalanceController < ActionController::Base

  skip_before_action :verify_authenticity_token

  def calculate
    if fields_data_json = params["humus_balance"]
      fields_data = fields_data_json["_json"]
      render json: HumusBalanceService.instance.calculate_humus_balance(fields_data)
    else
      render json: {"error" => "incorrect input"}
    end
  end
end
