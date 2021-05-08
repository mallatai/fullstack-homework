class HumusBalanceService
  include Singleton

  CONSECUTIVE_YEAR_MULTIPLIER = 1.3

  def calculate_humus_balance(fields_data)
    fields_data.map { |field|
      prev_year_crop = nil
      humus_balance = 0
      year_data = field["crops"]
      for i in 0.upto(year_data.length - 1) do
        current_year_data = year_data[i]
        crop_humus_delta = current_year_data["crop"]["humus_delta"]
        crop_label = current_year_data["crop"]["label"]
        current_humus_balance = (humus_balance || 0)

        updated_humus_balance = if crop_label == prev_year_crop
          current_humus_balance + crop_humus_delta * CONSECUTIVE_YEAR_MULTIPLIER
        else
          current_humus_balance + crop_humus_delta
        end

        prev_year_crop = current_year_data["crop"]["label"]
        humus_balance = updated_humus_balance
      end

      {field_id: field["id"], field_name: field["name"], humus_balance: humus_balance}
    }
  end
end
