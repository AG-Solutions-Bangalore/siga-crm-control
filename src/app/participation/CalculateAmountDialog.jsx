import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


const STALL_TYPES = {
    "Brand Wagon": [ "8x5", "6x4"],
    "Business Stall": ["6x4", "4x3"],
  };

const NO_OF_STALLS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const PRICING = {
    "Brand Wagon": {
      baseRate: 4900,
      taxRate: 0.18,
    },
    "Business Stall": {
      baseRate: 4200,
      taxRate: 0.18,
    },
  };

const CalculateAmountDialog = ({ form }) => {
  const [open, setOpen] = React.useState(false);
  const [stallSizes, setStallSizes] = React.useState([]);
  const [calculatedAmount, setCalculatedAmount] = React.useState("");
  const [selectedValues, setSelectedValues] = React.useState({
    stallType: "",
    stallSize: "",
    stallNo: "",
  });

  const handleStallTypeChange = (value) => {
    setStallSizes(STALL_TYPES[value] || []);
    setSelectedValues(prev => ({
      ...prev,
      stallType: value,
      stallSize: "",
      stallNo: "",
    }));
    setCalculatedAmount("");
  };

  const calculateAmount = () => {
    if (!selectedValues.stallType || !selectedValues.stallSize || !selectedValues.stallNo) return "";

    const [width, height] = selectedValues.stallSize.split("x").map(Number);
    const sizeMultiplier = width * height;
    const { baseRate, taxRate } = PRICING[selectedValues.stallType];
    const baseAmount = baseRate * sizeMultiplier * Number(selectedValues.stallNo);
    const taxAmount = baseAmount * taxRate;
    const totalAmount = baseAmount + taxAmount;

    setCalculatedAmount(totalAmount.toString());
  };

  const handlePopulateData = () => {
    form.setValue("profile_stall_size", selectedValues.stallSize);
    form.setValue("profile_stall_no", selectedValues.stallNo);
    form.setValue("profile_amount", calculatedAmount);
    setOpen(false);
  };

  React.useEffect(() => {
    if (selectedValues.stallType && selectedValues.stallSize && selectedValues.stallNo) {
      calculateAmount();
    }
  }, [selectedValues]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className="text-xs text-green-700  w-32 hover:text-red-800 cursor-pointer">
          Calculate Amount
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Calculate Amount</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select
              onValueChange={handleStallTypeChange}
              value={selectedValues.stallType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Stall Type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(STALL_TYPES).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Select
              onValueChange={(value) => 
                setSelectedValues(prev => ({ ...prev, stallSize: value }))}
              value={selectedValues.stallSize}
              disabled={!selectedValues.stallType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Stall Size" />
              </SelectTrigger>
              <SelectContent>
                {stallSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Select
              onValueChange={(value) => 
                setSelectedValues(prev => ({ ...prev, stallNo: value }))}
              value={selectedValues.stallNo}
              disabled={!selectedValues.stallSize}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Number of Stalls" />
              </SelectTrigger>
              <SelectContent>
                {NO_OF_STALLS.map((number) => (
                  <SelectItem key={number} value={number}>
                    {number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Input
              value={calculatedAmount}
              readOnly
              placeholder="Calculated Amount"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handlePopulateData}
            disabled={!calculatedAmount}
          >
            Populate Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalculateAmountDialog;