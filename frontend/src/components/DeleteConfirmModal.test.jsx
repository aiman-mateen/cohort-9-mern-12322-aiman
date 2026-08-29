import { render, screen, fireEvent } from "@testing-library/react"; 
import DeleteConfirmModal from "./DeleteConfirmModal"; 


describe("DeleteConfirmModal", () => { const mockOnClose = jest.fn(); 
    
    const mockOnConfirm = jest.fn(); 
    beforeEach(() => { jest.clearAllMocks(); }); 
    
    test("renders the delete confirmation modal", () => { render( <DeleteConfirmModal onClose={mockOnClose} onConfirm={mockOnConfirm} /> ); 
    
    expect( screen.getByRole("heading", { name: "Delete this note?" }) ).toBeInTheDocument(); 
    
    expect( screen.getByText( "This action can't be undone. The note will be permanently removed from your workspace." ) ).toBeInTheDocument(); 
    
    expect( screen.getByRole("button", { name: "Cancel" }) ).toBeInTheDocument(); 
    
    expect( screen.getByRole("button", { name: "Delete Note" }) ).toBeInTheDocument(); expect( screen.getByRole("button", { name: "Close" }) ).toBeInTheDocument(); 
}); 

test("calls onClose when Cancel is clicked", () => { render( 

<DeleteConfirmModal onClose={mockOnClose} onConfirm={mockOnConfirm} /> ); 

fireEvent.click( screen.getByRole("button", { name: "Cancel" }) ); 

expect(mockOnClose).toHaveBeenCalledTimes(1); 
expect(mockOnConfirm).not.toHaveBeenCalled(); }); 

test("calls onClose when the close button is clicked", () => { 
    render( <DeleteConfirmModal onClose={mockOnClose} onConfirm={mockOnConfirm} /> ); 
    
    fireEvent.click( screen.getByRole("button", { name: "Close" }) ); 
    
    expect(mockOnClose).toHaveBeenCalledTimes(1); 
    
    expect(mockOnConfirm).not.toHaveBeenCalled(); }); 
    
    test("calls onConfirm when Delete Note is clicked", () => { 
        render( <DeleteConfirmModal onClose={mockOnClose} onConfirm={mockOnConfirm} /> ); 
        
        fireEvent.click( screen.getByRole("button", { name: "Delete Note" }) ); 
        expect(mockOnConfirm).toHaveBeenCalledTimes(1); 
        
        expect(mockOnClose).not.toHaveBeenCalled(); }); 
        
        test("calls onClose when the modal overlay is clicked", () => { 
            render( <DeleteConfirmModal onClose={mockOnClose} onConfirm={mockOnConfirm} /> ); const overlay = document.querySelector(".modal-overlay"); 
            fireEvent.mouseDown(overlay); 
            
            expect(mockOnClose).toHaveBeenCalledTimes(1); }); 
            
            test("does not close when clicking inside the confirmation modal", () => { 
                render( <DeleteConfirmModal onClose={mockOnClose} onConfirm={mockOnConfirm} /> ); 
                
                const modal = document.querySelector(".confirm-modal"); 
                
                fireEvent.mouseDown(modal); 
                
                expect(mockOnClose).not.toHaveBeenCalled(); 
            }); 
        });