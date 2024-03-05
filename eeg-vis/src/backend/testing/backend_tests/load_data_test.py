# test_my_module.py
import unittest
import load_data

class load_data_test(unittest.TestCase):

    def test_extract_dimensions(self):
        self.assertEqual(load_data.x_dimensions('Data_Sample01_training.mat'), [795,64,300])
        self.assertEqual(load_data.y_dimensions('Data_Sample01_training.mat'), [5,300])
        self.assertEqual(load_data.className_dimensions('Data_Sample01_training.mat'), [1,5])
        self.assertEqual(load_data.channel_dimensions('Data_Sample01_training.mat'), [1,64])

    def test_extract_data(self):
        self.assertEqual(load_data.className_data('Data_Sample01_training.mat'), [['Hello'], ['Helpme'], ['Stop'], ['Thankyou'], ['Yes']])
        self.assertEqual(load_data.channel_data('Data_Sample01_training.mat'), 
                         [['Fp1'], ['Fp2'], ['F7'], ['F3'], ['Fz'], ['F4'], ['F8'], 
                          ['FC5'], ['FC1'], ['FC2'], ['FC6'], ['T7'], ['C3'], ['Cz'], 
                          ['C4'], ['T8'], ['TP9'], ['CP5'], ['CP1'], ['CP2'], ['CP6'], 
                          ['TP10'], ['P7'], ['P3'], ['Pz'], ['P4'], ['P8'], ['PO9'], 
                          ['O1'], ['Oz'], ['O2'], ['PO10'], ['AF7'], ['AF3'], ['AF4'], 
                          ['AF8'], ['F5'], ['F1'], ['F2'], ['F6'], ['FT9'], ['FT7'], 
                          ['FC3'], ['FC4'], ['FT8'], ['FT10'], ['C5'], ['C1'], ['C2'], 
                          ['C6'], ['TP7'], ['CP3'], ['CPz'], ['CP4'], ['TP8'], ['P5'], 
                          ['P1'], ['P2'], ['P6'], ['PO7'], ['PO3'], ['POz'], ['PO4'], ['PO8']])

if __name__ == '__main__':
    unittest.main()
