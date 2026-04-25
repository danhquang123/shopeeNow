package com.ecommerce.project.service.impl;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Address;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AddressDTO;
import com.ecommerce.project.repositories.AddressRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.service.AddressService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    AddressRepository addressRepository;
    @Autowired
    ModelMapper modelMapper;

    @Autowired
    UserRepository userRepository;


    @Override
    public AddressDTO createAddress(AddressDTO addressDTO, User user) {
        Address address = modelMapper.map(addressDTO, Address.class);
        List<Address> addressList = user.getAddresses();
        addressList.add(address);

        user.setAddresses(addressList);
        address.setUser(user);
        Address addressSave= addressRepository.save(address);
        return modelMapper.map(addressSave, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAllAddress() {
        // 1. Lấy tất cả Address từ Database
        List<Address> addresses = addressRepository.findAll();

        // 2. Kiểm tra nếu không có dữ liệu thì báo lỗi (hoặc trả về list rỗng tùy bạn)
        if (addresses.isEmpty()) {
            throw new APIException("No addresses found!");
        }

        // 3. Map danh sách Entity sang danh sách DTO
        List<AddressDTO> addressDTOs = addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());

        return addressDTOs;
    }

    @Override
    public AddressDTO getAddressId( Long addressId) {

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address " , " AddressId ", addressId));
        return  modelMapper.map(address, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getUserAddress(User user) {
        List<Address> addresses = user.getAddresses();

        // 2. Kiểm tra nếu không có dữ liệu thì báo lỗi (hoặc trả về list rỗng tùy bạn)
        if (addresses.isEmpty()) {
            throw new APIException("No addresses found!");
        }

        // 3. Map danh sách Entity sang danh sách DTO
        List<AddressDTO> addressDTOs = addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());

        return addressDTOs;
    }

    @Override
    public AddressDTO updateAddress(Long addressId, AddressDTO addressDTO) {
        // 1. Tìm địa chỉ cũ trong DB, không thấy thì báo lỗi ngay
        Address addressFromDb = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        // 2. Ghi đè dữ liệu từ DTO vào Entity đã tìm thấy
        addressFromDb.setStreet(addressDTO.getStreet());
        addressFromDb.setBuildingName(addressDTO.getBuildingName());
        addressFromDb.setCity(addressDTO.getCity());
        addressFromDb.setState(addressDTO.getState());
        addressFromDb.setCountry(addressDTO.getCountry());
        addressFromDb.setPincode(addressDTO.getPincode());

        // 3. Lưu địa chỉ đã cập nhật
        Address updatedAddress = addressRepository.save(addressFromDb);

        // Nếu Address có liên kết với User, Hibernate sẽ tự giữ nguyên user_id cũ
        // vì chúng ta đang thao tác trên đối tượng lấy từ DB lên.

        User user = addressFromDb.getUser();
        user.getAddresses().removeIf(address -> address.getAddressId().equals(addressId));
        user.getAddresses().add(updatedAddress);

        userRepository.save(user);

        // 4. Trả về DTO sau khi map lại
        return modelMapper.map(updatedAddress, AddressDTO.class);
    }

    @Override
    public String deleteAddress(Long addressId) {
        // 1. Tìm Address trong DB, không thấy thì quăng lỗi
        Address addressFromDb = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        // 2. Lấy User chủ sở hữu của địa chỉ này
        User user = addressFromDb.getUser();

        // 3. Xóa địa chỉ này khỏi danh sách addresses của User (Cập nhật RAM)
        user.getAddresses().removeIf(address -> address.getAddressId().equals(addressId));

        // Cập nhật lại User để đồng bộ mối quan hệ
        userRepository.save(user);

        // 4. Tiến hành xóa Address khỏi Database
        addressRepository.delete(addressFromDb);

        return "Address deleted successfully with addressId: " + addressId;
    }
}
